
import { MonitoredUser } from "../types/monitoring";

interface Props {
  user: MonitoredUser;
  onCategoryToggle: (email: string, categories: string[]) => void;
}

const AVAILABLE_CATEGORIES = [
  { id: "adult", label: "Adult Content" },
  { id: "gambling", label: "Gambling" },
  { id: "social_media", label: "Social Media" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "online":
      return { color: "bg-green-100 text-green-700", label: "Online" };
    case "offline":
      return { color: "bg-yellow-100 text-yellow-700", label: "Offline" };
    case "possibly_uninstalled":
      return { color: "bg-red-100 text-red-700", label: "Possibly Uninstalled" };
    case "uninstalled":
      return { color: "bg-red-100 text-red-700", label: "Uninstalled" };
    default:
      return { color: "bg-gray-100 text-gray-600", label: "Unknown" };
  }
}

function formatLastSeen(lastSeen: string | null): string {
  if (!lastSeen) return "Never";
  const date = new Date(lastSeen);
  const now = Date.now();
  const diffMin = Math.floor((now - date.getTime()) / (1000 * 60));
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function MonitoredUserCard({ user, onCategoryToggle }: Props) {
  const badge = getStatusBadge(user.extensionStatus);

  const handleToggle = (categoryId: string) => {
    const current = user.blocked_categories || [];
    const updated = current.includes(categoryId)
      ? current.filter((c) => c !== categoryId)
      : [...current, categoryId];
    onCategoryToggle(user.email, updated);
  };

  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
        <span>Last seen: {formatLastSeen(user.lastSeen)}</span>
        <span className="flex items-center gap-1">
          Incognito:
          {user.incognitoEnabled === null ? (
            <span className="text-gray-400">N/A</span>
          ) : user.incognitoEnabled ? (
            <span className="text-green-600 font-medium">Enabled</span>
          ) : (
            <span className="text-red-500 font-medium">Disabled</span>
          )}
        </span>
      </div>

      <div className="border-t pt-2">
        <p className="text-xs text-gray-500 mb-1">Blocked Categories</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_CATEGORIES.map((cat) => {
            const isActive = (user.blocked_categories || []).includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => handleToggle(cat.id)}
                className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                  isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MonitoredUserCard;
