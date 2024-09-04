import { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import profile from "../assets/profile.jpeg";

function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (!user) {
        toast.error("No authenticated user found.");
        navigate("/login");
        return;
      }

      setUserEmail(user.email);

      // Fetch additional user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserName(userData.displayName || "Unknown User");
        } else {
          console.log("No such document!");
          setUserName("Unknown User");
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error.message);
        toast.error("Error fetching user data.");
        setUserName("Unknown User");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Successfully logged out.");
      navigate("/login");
    } catch (error: any) {
      console.error("Error logging out:", error.message);
      toast.error("Error logging out.");
    }
  };

  return (
    <div className="flex w-full justify-between p-2 items-center">
      <img src={logo} className="h-10 w-20" alt="Logo" />
      <span className="flex text-xs items-center">
        <img src={profile} className="h-10 w-10 rounded-full" alt="Profile" />
        <span className="ml-2">
          <p className="font-semibold">{userName || "Loading..."}</p>
          <p>{userEmail || "Loading..."}</p>
        </span>
      </span>
      <span onClick={handleLogout} className="cursor-pointer">
        <MdLogout className="text-gray-500 text-xl" />
      </span>
    </div>
  );
}

export default Navbar;
