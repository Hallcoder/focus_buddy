import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Tab from "../components/tab";
import Tabs from "../components/tabs";
import ListingComponent from "../components/ListingComponent";
import FloatingActionButton from "../components/floatingActionButton";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { extractURLComponents } from "../utils/commonFunctions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaRegSadTear } from "react-icons/fa";
import { fetchBuddiesByEmail } from "../utils/firebaseFunctions";

function Home() {
  const [blockedurls, setBlockedUrls] = useState<string[]>([]);
  const [chosenBuddies, setChosenBuddies] = useState<any[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [loadingBuddies, setLoadingBuddies] = useState(true);
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
    const fetchChosenBuddies = async () => {
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
          const moderators = data.moderators || [];

          // Fetch buddies by email
          const buddies = await fetchBuddiesByEmail(moderators);
          setChosenBuddies(buddies);
        } else {
          console.log("No such document!");
        }
      } catch (error: any) {
        console.error("Error fetching chosen buddies:", error.message);
      } finally {
        setLoadingBuddies(false);
      }
    };

    fetchChosenBuddies();
  }, []);
  const handleEditUrl = (existingUrl: string) => {
    navigate("/add-blacklisted-urls", {
      state: { existingUrl }, // Pass the existing URL via state
    });
  };
  return (
    <div className="flex flex-col h-full">
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
          ) : chosenBuddies.length > 0 ? (
            chosenBuddies.map((buddy: any) => (
              <ListingComponent
                key={buddy.id}
                title={buddy.name}
                type="buddy"
                subTitle={buddy.email}
                onEdit={() => console.log("Edit action triggered!")}
                onRemove={() => console.log("Remove action triggered!")}
                onViewDetails={() => console.log("View Buddy Details")}
                onSendNotification={() =>
                  console.log("Send Notification to Buddy")
                }
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
    </div>
  );
}

export default Home;
