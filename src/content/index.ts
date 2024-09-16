// Import Firebase configuration and Firestore-related services
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Define variables for blocked sites and their loading status
let blockedSites: string[] = [];
let blockedSitesLoaded = false; // Track if blocked URLs have been loaded

// Use chrome.storage.local to cache blocked URLs
const BLOCKED_SITES_CACHE_KEY = "blockedSitesCache";

// Fetch blocked URLs from Firestore and store them in chrome.storage.local
async function fetchBlockedUrlsForUser(userId: string) {
  try {
    console.log("Fetching blocked URLs from Firestore...");
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      blockedSites = userData?.blocked_urls || [];
      blockedSitesLoaded = true;
      console.log("Fetched blocked URLs from Firestore:", blockedSites);

      // Cache the blocked URLs for faster future access
      chrome.storage.local.set({ [BLOCKED_SITES_CACHE_KEY]: blockedSites });
    } else {
      console.log("No user data found.");
    }
  } catch (error) {
    console.error("Error fetching blocked URLs from Firestore:", error);
  }
}

// Utility function to extract the base domain from a URL
function extractBaseDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    // Remove "www." prefix if present
    return domain.startsWith("www.") ? domain.substring(4) : domain;
  } catch (e) {
    console.error("Error parsing URL:", url, e);
    return "";
  }
}

// Function to check if the base domain of a URL is blocked
function isBlocked(url: string): boolean {
  const baseDomain = extractBaseDomain(url);
  console.log("Base Domain:", baseDomain);

  if (!blockedSites || blockedSites.length === 0) {
    console.log("blockedSites array is empty or not populated yet.");
    return false;
  }

  const isBlocked = blockedSites.some((blockedSite) => {
    const blockedDomain = extractBaseDomain(blockedSite);
    return baseDomain === blockedDomain;
  });

  console.log("Is Blocked:", isBlocked);
  return isBlocked;
}

// Function to fetch moderators' emails from Firestore
async function fetchModeratorsEmails() {
  try {
    const moderatorsRef = doc(db, "settings", "moderators"); // Example location
    const moderatorsSnap = await getDoc(moderatorsRef);

    if (moderatorsSnap.exists()) {
      const moderatorsData = moderatorsSnap.data();
      return moderatorsData?.emails || [];
    } else {
      console.log("No moderators data found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching moderators emails:", error);
    return [];
  }
}

// Function to fetch the user's email from Firestore
async function fetchUserEmail(userId: string): Promise<string | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData?.email || null;
    } else {
      console.log("No user data found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user email:", error);
    return null;
  }
}

// Function to notify moderators
async function notifyModerator(url: string, userId: string) {
  console.log("Notifying moderators");
  const userEmail = await fetchUserEmail(userId);
  const moderators = await fetchModeratorsEmails();

  if (!userEmail) {
    console.error("User email not found.");
    return;
  }

  if (moderators.length === 0) {
    console.error("No moderators found.");
    return;
  }

  // Send the notification using a Node.js server with Nodemailer
  try {
    await fetch('http://localhost:3000/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        userEmail,
        moderators,
      }),
    });
    console.log("Notification sent to moderators for blocked site:", url);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

// Function to notify user and close the tab
function notifyAndCloseTab(url: string) {
  console.log("Closing site...");
  // Close the current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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

// Check URL against blocked sites from cache and Firestore
async function checkUrlAgainstBlockedSites(url: string, userId: string) {
  // Load blocked URLs from cache
  chrome.storage.local.get([BLOCKED_SITES_CACHE_KEY], async (result) => {
    if (result[BLOCKED_SITES_CACHE_KEY]) {
      blockedSites = result[BLOCKED_SITES_CACHE_KEY];
      blockedSitesLoaded = true;
      console.log("Loaded blocked URLs from cache:", blockedSites);

      // Check if the URL is blocked immediately
      if (isBlocked(url)) {
        console.log("Blocked site detected from cache:", url);
        notifyAndCloseTab(url);
        await notifyModerator(url, userId);
      }
    }

    // Fetch the latest blocked URLs from Firestore
    await fetchBlockedUrlsForUser(userId);

    // Check again if the URL is blocked after Firestore fetch
    if (isBlocked(url)) {
      console.log("Blocked site detected from Firestore:", url);
      notifyAndCloseTab(url);
      await notifyModerator(url, userId);
    }
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "urlChanged") {
    const url = message.url;
    const userId = message.userId; // Ensure user ID is provided in the message
    console.log("URL received:", url);

    // Check against blocked sites both locally and from Firestore
    await checkUrlAgainstBlockedSites(url, userId);
  }

  // Handle user login data from background.js
  if (message.action === "userLoggedIn") {
    const userId = message.userId;
    console.log("User logged in (content.js):", userId);

    // Fetch blocked URLs for the authenticated user
    fetchBlockedUrlsForUser(userId);
  }
});

export {};
