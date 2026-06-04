import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaRegSadTear } from "react-icons/fa";

const getViolationHistoryFunc = httpsCallable(functions, "getViolationHistory");

interface Violation {
  id: string;
  url: string;
  timestamp: string | null;
  notifiedCount: number;
}

function formatRelativeTime(isoString: string | null): string {
  if (!isoString) return "Unknown time";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function ViolationHistory() {
  const navigate = useNavigate();
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const result = await getViolationHistoryFunc({});
        const data = result.data as { violations: Violation[] };
        setViolations(data.violations);
      } catch (err: any) {
        setError(err.message || "Failed to load violation history");
      } finally {
        setLoading(false);
      }
    };
    fetchViolations();
  }, []);

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
        <h2 className="font-semibold text-xl mb-4">Violation History</h2>

        {loading ? (
          <Skeleton count={5} height={60} />
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : violations.length > 0 ? (
          <div className="space-y-3">
            {violations.map((v) => (
              <div
                key={v.id}
                className="p-3 bg-white border rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-800 truncate max-w-[70%]">
                    {v.url}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatRelativeTime(v.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {v.notifiedCount} buddy{v.notifiedCount !== 1 ? "ies" : "y"} notified
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6">
            <FaRegSadTear size={48} color="#999" />
            <p className="mt-4 text-gray-500">No violations recorded yet. Keep it up!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViolationHistory;
