import { useEffect, useState, useContext } from "react";
import Navbar from "../components/navbar";
import Tab from "../components/tab";
import Tabs from "../components/tabs";
import ListingComponent from "../components/ListingComponent";
import FloatingActionButton from "../components/floatingActionButton";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { doc, getDoc, getDocs, collection, updateDoc } from "firebase/firestore";
import { extractURLComponents } from "../utils/commonFunctions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaRegSadTear } from "react-icons/fa";
import { AuthContext } from "../config/authProvider";
import Onboarding from "../components/Onboarding";
import BuddyDetailsModal from '../components/BuddyDetailsModal';
import { sendNotificationToBuddy } from '../utils/notificationFunctions';
import { BuddyConfig } from "../functions/migrateSchema";

function Home() {
  const { hasCompletedOnboarding, setHasCompletedOnboarding } = useContext(AuthContext);
  const [blockedurls, setBlockedUrls] = useState<string[]>([]);
  const [buddyConfigs, setBuddyConfigs] = useState<Record<string, any>>({});
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [loadingBuddies, setLoadingBuddies] = useState(true);
  const [selectedBuddy, setSelectedBuddy] = useState<BuddyConfig | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBlockedUrls = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.error("No authenticated user found.");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBlockedUrls(data.blocked_urls || []);
        } else {
          console.log("No such document!");
        }
      } catch (error: any) {
        console.error("Error fetching blocked URLs:", error.message);
      } finally {
        setLoadingUrls(false);
      }
    };

    fetchBlockedUrls();
  }, []);

  useEffect(() => {
    const fetchBuddyConfigs = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.error("No authenticated user found.");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBuddyConfigs(data.buddyConfigs || {});
        } else {
          console.log("No such document!");
        }
      } catch (error: any) {
        console.error("Error fetching buddy configs:", error.message);
      } finally {
        setLoadingBuddies(false);
      }
    };

    fetchBuddyConfigs();
  }, []);
  const handleEditUrl = (existingUrl: string) => {
    navigate("/add-blacklisted-urls", {
      state: { existingUrl }, // Pass the existing URL via state
    });
  };
  const handleOnboardingComplete = async () => {
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        hasCompletedOnboarding: true
      });
      setHasCompletedOnboarding(true);
    }
  };
  const handleViewDetails = (buddyConfig: BuddyConfig) => {
    const completeConfig: BuddyConfig = {
      email: buddyConfig.email,
      nickname: buddyConfig.nickname || '',
      penaltyAmount: buddyConfig.penaltyAmount,
      paymentMethod: buddyConfig.paymentMethod,
      paymentDetails: buddyConfig.paymentDetails,
      addedAt: buddyConfig.addedAt
    };
    setSelectedBuddy(completeConfig);
  };

  const handleUpdateBuddy = async (updatedConfig: BuddyConfig) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found.");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userDocRef, {
        [`buddyConfigs.${updatedConfig.email}`]: updatedConfig
      });
      setBuddyConfigs((prevConfigs) => ({
        ...prevConfigs,
        [updatedConfig.email]: updatedConfig
      }));
      sendNotificationToBuddy(updatedConfig.email, "Your buddy details have been updated.");
    } catch (error) {
      console.error("Error updating buddy details:", error);
    }
  };

  const handleRemoveBuddy = async (email: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found.");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    try {
      // Remove the buddy from the buddyConfigs
      const updatedBuddyConfigs = { ...buddyConfigs };
      delete updatedBuddyConfigs[email];

      await updateDoc(userDocRef, {
        buddyConfigs: updatedBuddyConfigs
      });

      setBuddyConfigs(updatedBuddyConfigs);
      sendNotificationToBuddy(email, "You have been removed as a buddy.");
    } catch (error) {
      console.error("Error removing buddy:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {!hasCompletedOnboarding ? (
        <Onboarding  />
      ) : (
        <>
          <Navbar />
          <Tabs>
            <Tab label="Blacklisted URLs">
              {loadingUrls ? (
                <Skeleton count={5} height={40} />
              ) : blockedurls.length > 0 ? (
                blockedurls.map((url) => (
                  <ListingComponent
                    key={url}
                    type="url"
                    title={extractURLComponents(url)?.domain || url}
                    subTitle={url}
                    onEdit={() => handleEditUrl(url)}
                    onRemove={() => console.log("Remove action triggered!")}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-6">
                  <FaRegSadTear size={48} color="#999" />
                  <p className="mt-4 text-gray-500">No URLs registered yet.</p>
                </div>
              )}
            </Tab>
            <Tab label="Chosen Buddies">
              {loadingBuddies ? (
                <Skeleton count={5} height={60} />
              ) : Object.entries(buddyConfigs).length > 0 ? (
                Object.entries(buddyConfigs).map(([email, config]: [string, any]) => (
                  <ListingComponent
                    key={email}
                    type="buddy"
                    title={config.nickname || email}
                    subTitle={`${email} - Penalty: $${config.penaltyAmount} - Payment: ${config.paymentMethod}`}
                    onEdit={() => handleViewDetails({...config, email})}
                    onRemove={() => handleRemoveBuddy(email)}
                    onViewDetails={() => handleViewDetails({...config, email})}
                    onSendNotification={() => sendNotificationToBuddy(email, "Notification sent to buddy.")}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-6">
                  <FaRegSadTear size={48} color="#999" />
                  <p className="mt-4 text-gray-500">No buddies registered yet.</p>
                </div>
              )}
            </Tab>
          </Tabs>
          {selectedBuddy && (
            <BuddyDetailsModal
              buddyConfig={selectedBuddy}
              onClose={() => setSelectedBuddy(null)}
              onUpdate={handleUpdateBuddy}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Home;
