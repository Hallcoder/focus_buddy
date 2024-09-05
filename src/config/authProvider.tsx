import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Import your Firebase auth config
import { useNavigate } from "react-router-dom";

// Create AuthContext
export const AuthContext = createContext<any>(null);  // Export AuthContext

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);  // Set user if authenticated
        console.log("User is authenticated:", user);
      } else {
        setCurrentUser(null);  // Set null if no user is authenticated
        console.log("User is not authenticated");
        navigate("/login");
      }
      setLoading(false); // Stop loading once auth state is determined
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a spinner or loader
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
