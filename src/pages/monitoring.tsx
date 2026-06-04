import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";
import { MonitoredUser } from "../types/monitoring";
import Navbar from "../components/navbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaRegSadTear } from "react-icons/fa";
import MonitoredUserCard from "../components/MonitoredUserCard";

const getMonitoringStatusFunc = httpsCallable(functions, "getMonitoringStatus");
const updateBlockedCategoriesFunc = httpsCallable(functions, "updateBlockedCategories");

function MonitoringDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<MonitoredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const result = await getMonitoringStatusFunc({});
      const data = result.data as { users: MonitoredUser[] };
      setUsers(data.users);
    } catch (err: any) {
      console.error("Error fetching monitoring status:", err);
      if (err?.code === "functions/not-found" || err?.message?.includes("404")) {
        setError("Cloud Functions not deployed yet. Deploy with: firebase deploy --only functions");
      } else {
        setError("Failed to load monitoring data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = async (email: string, categories: string[]) => {
    try {
      await updateBlockedCategoriesFunc({ targetEmail: email, categories });
      setUsers((prev) =>
        prev.map((u) =>
          u.email === email ? { ...u, blocked_categories: categories } : u
        )
      );
    } catch (err: any) {
      console.error("Error updating categories:", err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-3 text-primary hover:text-primary text-sm"
        >
          ← Back
        </button>
        <h2 className="text-lg font-semibold mb-3">People You Monitor</h2>
        {loading ? (
          <Skeleton count={3} height={80} className="mb-2" />
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : users.length > 0 ? (
          <div className="space-y-3">
            {users.map((user) => (
              <MonitoredUserCard
                key={user.email}
                user={user}
                onCategoryToggle={handleCategoryToggle}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6">
            <FaRegSadTear size={48} color="#999" />
            <p className="mt-4 text-gray-500 text-sm">
              You're not monitoring anyone yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MonitoringDashboard;
