// background/index.ts (background script)

import { auth, db } from '../config/firebase';
import { doc, getDoc } from "firebase/firestore";

// Listen for extension startup and installation events to sync blacklist
chrome.runtime.onStartup.addListener(() => {
  syncBlacklistWithLocalStorage();
});

chrome.runtime.onInstalled.addListener(() => {
  syncBlacklistWithLocalStorage();
});

async function syncBlacklistWithLocalStorage() {
  // Listen for authentication state changes
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userId = user.uid;
      try {
        // Get a reference to the user's document in the "users" collection
        const docRef = doc(db, "users", userId);

        // Fetch the user's document from Firestore
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Extract the blocked URLs from the user's document
          const blockedUrls = docSnap.data().blocked_urls;
          console.log("APPLICATION LOG:",blockedUrls);
          // Store the blocked URLs in Chrome's local storage
          chrome.storage.local.set({ blacklistedUrls: blockedUrls }, () => {
            console.log('Blocked URLs saved to local storage.');
          });
        } else {
          console.log('No user data found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      console.log('No user is signed in.');
    }
  });
}

// Example: Access the blacklist from Chrome's local storage
chrome.storage.local.get(['blacklistedUrls'], (result) => {
  console.log('Blocked URLs retrieved from local storage:', result.blacklistedUrls);
  // Use the blocked URLs in your extension as needed
});
