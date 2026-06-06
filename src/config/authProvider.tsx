import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "./firebase";

// Create AuthContext
export const AuthContext = createContext<any>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/reset-password", "/terms", "/privacy"];

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.data();
        setHasCompletedOnboarding(data?.hasCompletedOnboarding ?? false);
        setSubscriptionStatus(data?.subscriptionStatus ?? null);

        // Compute premium status: active subscription OR active trial
        const hasActiveSubscription = data?.subscriptionStatus === "active";
        let inTrial = false;
        let daysLeft: number | null = null;

        if (data?.trialEndsAt) {
          const trialEnd = new Date(data.trialEndsAt).getTime();
          const now = Date.now();
          if (trialEnd > now) {
            inTrial = true;
            daysLeft = Math.ceil((trialEnd - now) / (24 * 60 * 60 * 1000));
          }
        }

        setIsPremium(hasActiveSubscription || inTrial);
        setTrialDaysLeft(inTrial ? daysLeft : null);
        console.log("User is authenticated:", user);
      } else {
        setCurrentUser(null);
        setHasCompletedOnboarding(null);
        setSubscriptionStatus(null);
        setIsPremium(false);
        setTrialDaysLeft(null);

        // Redirect only if the current route is not a public route
        if (!publicRoutes.includes(location.pathname)) {
          console.log("User is not authenticated, redirecting to login.");
          navigate("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, location.pathname]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      hasCompletedOnboarding,
      setHasCompletedOnboarding,
      subscriptionStatus,
      setSubscriptionStatus,
      isPremium,
      trialDaysLeft,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
