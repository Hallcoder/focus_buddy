import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";

console.log("Background script loaded...");

// Key for caching blocked sites in `chrome.storage.local`
const BLOCKED_SITES_CACHE_KEY = "blockedSitesCache";

// In-memory cache to reduce repeated storage reads
let blockedSites: string[] = [];
let blockedSitesLoaded = false;

// Constants for notification handling
const NOTIFICATION_COOLDOWN = 1000 * 60 * 30; // 30 minutes
const recentNotifications = new Map<string, number>();

// Notify content scripts about URL changes
async function notifyURLChange(tabId: number, url: string): Promise<void> {
  if (!auth.currentUser) return;
  
  const isBlockedSite = isBlocked(url);
  if (isBlockedSite) {
    await handleBlockedDomain(url, auth.currentUser.uid);
    // Send message to content script to handle the blocked site
    chrome.tabs.sendMessage(tabId, { 
      action: "siteBlocked",
      url 
    });
  }
}

// Utility function to extract the base domain from a URL
function extractBaseDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    return domain.startsWith("www.") ? domain.substring(4) : domain; // Remove "www."
  } catch (e) {
    console.error("Error parsing URL:", url, e);
    return "";
  }
}

// Fetch blocked URLs from Firestore for the logged-in user
async function fetchBlockedUrlsFromFirestore(userId: string): Promise<void> {
  try {
    console.log("Fetching blocked URLs from Firestore...");
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      blockedSites = userData?.blocked_urls || [];
      blockedSitesLoaded = true;
      console.log("Blocked sites fetched from Firestore:", blockedSites);

      // Cache the blocked sites in chrome.storage.local
      chrome.storage.local.set({ [BLOCKED_SITES_CACHE_KEY]: blockedSites });
    } else {
      console.log("No blocked sites found for user.");
    }
  } catch (error) {
    console.error("Error fetching blocked sites from Firestore:", error);
  }
}

// Load blocked sites from cache
function loadBlockedSitesFromCache(): Promise<string[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([BLOCKED_SITES_CACHE_KEY], (result) => {
      if (result[BLOCKED_SITES_CACHE_KEY]) {
        console.log("Loaded blocked sites from cache:", result[BLOCKED_SITES_CACHE_KEY]);
        resolve(result[BLOCKED_SITES_CACHE_KEY]);
      } else {
        console.log("No cached blocked sites found.");
        resolve([]);
      }
    });
  });
}

// Notify moderators about blocked site access
async function notifyModerators(url: string, userId: string) {
  console.log("Checking notification cooldown for:", url);
  
  // Create a unique key for this user and URL combination
  const notificationKey = `${userId}-${url}`;
  const now = Date.now();
  const lastNotification = recentNotifications.get(notificationKey);

  // Check if we've recently sent a notification for this URL
  if (lastNotification && (now - lastNotification) < NOTIFICATION_COOLDOWN) {
    console.log("Skipping notification - too soon since last notification");
    return;
  }

  console.log("Notifying moderators for blocked site access...");
  try {
    // Get user data to fetch moderators and user's name
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      throw new Error("User data not found");
    }

    const userData = userDocSnap.data();
    const moderators = userData.moderators || [];
    const userName = userData.name || "A user";

    // Send notification to each moderator
    const notifications = moderators.map(async (moderatorEmail: string) => {
      try {
        const response = await fetch("http://localhost:3000/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buddyEmail: moderatorEmail,
            userName: userName,
            text: `${userName} just visited ${url}, a site they're trying to avoid.`
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(`Notification sent to ${moderatorEmail}:`, result);
      } catch (error) {
        console.error(`Failed to notify moderator ${moderatorEmail}:`, error);
      }
    });

    // Wait for all notifications to be sent
    await Promise.all(notifications);
    
    // Update the last notification timestamp
    recentNotifications.set(notificationKey, now);
    
    // Clean up old entries from the Map
    const OLD_ENTRY_THRESHOLD = NOTIFICATION_COOLDOWN * 2;
    recentNotifications.forEach((timestamp, key) => {
      if (now - timestamp > OLD_ENTRY_THRESHOLD) {
        recentNotifications.delete(key);
      }
    });

    console.log("All notifications sent for blocked site:", url);
  } catch (error) {
    console.error("Error in notifyModerators:", error);
  }
}

// Handle blocked domain detection
async function handleBlockedDomain(url: string, userId: string) {
  console.log(`Blocked domain accessed by user ${userId}: ${url}`);
  await notifyModerators(url, userId);
}

// Check if a URL is blocked by comparing against the blocked list
function isBlocked(url: string): boolean {
  const baseDomain = extractBaseDomain(url);
  console.log("Checking if URL is blocked. Base Domain:", baseDomain);

  const isBlocked = blockedSites.some((blockedUrl) => {
    const blockedDomain = extractBaseDomain(blockedUrl);
    return baseDomain === blockedDomain;
  });

  console.log("Is URL Blocked?", isBlocked);
  return isBlocked;
}

// Process URL against blocked sites
async function processUrl(url: string, userId: string) {
  console.log("Processing URL:", url);

  if (!blockedSitesLoaded) {
    // Load blocked sites from cache or Firestore
    blockedSites = await loadBlockedSitesFromCache();
    if (blockedSites.length === 0) {
      await fetchBlockedUrlsFromFirestore(userId);
    }
  }

  // Check if the URL is blocked
  if (isBlocked(url)) {
    console.log("Blocked site detected:", url);
    await handleBlockedDomain(url, userId);
  }
}

// Notify all tabs about the logged-in user
function broadcastLoggedInUser(user: any) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id!, {
        action: "userLoggedIn",
        userId: user.uid,
      });
    });
  });
}

// Firebase auth listener to detect user state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User logged in:", user.uid);
    broadcastLoggedInUser(user);

    // Pre-fetch blocked URLs for the authenticated user
    await fetchBlockedUrlsFromFirestore(user.uid);
  } else {
    console.log("No user signed in.");
    blockedSites = []; // Clear the blocked sites if no user is logged in
    blockedSitesLoaded = false;
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && auth.currentUser) {
    console.log("URL visited:", tab.url);
    notifyURLChange(tabId, tab.url);
  }
});

// Add this function to handle tab closing
function closeTab(url: string) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("Tabs", tabs);
    if (tabs.length > 0 && tabs[0]?.id) {
      chrome.tabs.remove(tabs[0].id, () => {
        if (chrome.runtime.lastError) {
          console.error("Error closing tab:", chrome.runtime.lastError.message);
        } else {
          console.log("Tab closed successfully");
        }
      });
    } else {
      console.log("No active tab found to close");
    }
  });
}

// Update the message listener to handle closeTab action
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "checkBlockedUrl") {
    const url = message.url;
    console.log("Message received to check blocked URL:", url);

    if (!auth.currentUser) {
      sendResponse({ isBlocked: false });
      return true;
    }

    const isBlockedSite = isBlocked(url);
    if (isBlockedSite) {
      await handleBlockedDomain(url, auth.currentUser.uid);
    }
    sendResponse({ isBlocked: isBlockedSite });
  } else if (message.action === "closeTab") {
    closeTab(message.url);
  }
  return true;
});

export {};
