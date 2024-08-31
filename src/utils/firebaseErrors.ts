export const firebaseErrors: { [key: string]: string } = {
    'auth/email-already-in-use': 'This email is already in use.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/weak-password': 'The password is too weak. Please use at least 6 characters.',
    'auth/user-not-found': 'No user found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many requests. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    // Add more Firebase error codes and messages as needed
  };
  