import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Import your Firebase auth config
import { useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "./firebase"; // Add this import

// Create AuthContext
export const AuthContext = createContext<any>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/reset-password"];

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user); // Set user if authenticated
        // Fetch user's onboarding status
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setHasCompletedOnboarding(userDoc.data()?.hasCompletedOnboarding ?? false);
        console.log("User is authenticated:", user);
      } else {
        setCurrentUser(null); // Clear user if unauthenticated
        setHasCompletedOnboarding(null);

        // Redirect only if the current route is not a public route
        if (!publicRoutes.includes(location.pathname)) {
          console.log("User is not authenticated, redirecting to login.");
          navigate("/login");
        }
      }
      setLoading(false); // Stop loading once auth state is determined
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a spinner or loader
  }

  return (
    <AuthContext.Provider value={{ currentUser, hasCompletedOnboarding, setHasCompletedOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
