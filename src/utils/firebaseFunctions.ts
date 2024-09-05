import { auth, db } from "../config/firebase"; // Adjust the path as needed
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  where,
  query,
  getDocs,
  getDoc,
  arrayRemove,
} from "firebase/firestore";

export const addBlockedUrl = async (newUrl: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is currently logged in.");
  }

  const userDocRef = doc(db, "users", user.uid);

  try {
    await updateDoc(userDocRef, {
      blocked_urls: arrayUnion(newUrl),
    });
    console.log("URL added successfully to the blocked list.");
  } catch (error) {
    console.error("Error adding URL to the blocked list:", error);
    throw new Error("Failed to add URL. Please try again.");
  }
};
export const updateBlockedUrl = async (oldUrl: string, newUrl: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is currently logged in.");
  }

  const userDocRef = doc(db, "users", user.uid);

  try {
    // First, retrieve the current list of blocked URLs
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error("User document does not exist.");
    }

    const userData = userDocSnap.data();
    const blockedUrls = userData?.blocked_urls || [];

    // Check if the old URL exists in the list
    if (!blockedUrls.includes(oldUrl)) {
      throw new Error(
        "The URL to be updated was not found in the blocked list."
      );
    }

    // Remove the old URL and add the new URL
    await updateDoc(userDocRef, {
      blocked_urls: arrayRemove(oldUrl),
    });
    await updateDoc(userDocRef, {
      blocked_urls: arrayUnion(newUrl),
    });

    console.log("URL updated successfully in the blocked list.");
  } catch (error) {
    console.error("Error updating URL in the blocked list:", error);
    throw new Error("Failed to update URL. Please try again.");
  }
};
export async function fetchBuddiesByEmail(emails: string[]): Promise<any[]> {
  try {
    // Ensure the email list is not empty and contains valid emails
    if (emails.length === 0) {
      console.warn("No emails provided for fetching buddies.");
      return [];
    }

    // Create a query to find users by email
    const usersQuery = query(
      collection(db, "users"),
      where("email", "in", emails)
    );

    // Fetch the documents
    const querySnapshot = await getDocs(usersQuery);

    // Extract user data from query snapshot
    const buddies = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID if needed
      ...doc.data(), // Spread the document data
    }));

    return buddies;
  } catch (error: any) {
    console.error("Error fetching buddies:", error.message);
    return [];
  }
}
export async function fetchUserByEmail(email: string) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Assuming emails are unique, there should be at most one result
      const userDoc = querySnapshot.docs[0];
      return userDoc.data();
    } else {
      console.log("No user found with this email.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}
