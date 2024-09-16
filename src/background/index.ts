import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

console.log("Background script loaded...");

// Listen for webNavigation events (when a URL is completely loaded)
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.url) {
    // Notify the content script about the URL change
    chrome.tabs.sendMessage(details.tabId, { action: "urlChanged", url: details.url });
  }
}, { url: [{ hostContains: '.' }] });

// Listen for tab updates (also captures URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("URL visited:",tab.url)
  if (changeInfo.status === "complete" && tab.url) {
    // Notify the content script about the URL change
    chrome.tabs.sendMessage(tabId, { action: "urlChanged", url: tab.url });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and background script is running.");
  chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("logo192.png"),
    title: "Test Notification",
    message: "This is a test notification to check functionality.",
  });
});

// Function to send the logged-in user's ID to content scripts
function sendUserToContentScripts(user:any) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab:any) => {
      chrome.tabs.sendMessage(tab.id, {
        action: "userLoggedIn",
        userId: user.uid
      });
    });
  });
}

// Listen for Firebase authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in (background):", user.uid);

    // Send the logged-in user's ID to all content scripts
    sendUserToContentScripts(user);
  } else {
    console.log("No user is logged in (background).");
  }
});

export {};
