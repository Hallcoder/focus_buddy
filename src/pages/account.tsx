import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import useAuth from "../hooks/useAuth";
import { functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions";
import { useState } from "react";
import toast from "react-hot-toast";

function Account() {
  const navigate = useNavigate();
  const { isPremium, trialDaysLeft, subscriptionStatus } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const getPlanLabel = () => {
    if (subscriptionStatus === "active") return "Premium";
    if (trialDaysLeft !== null) return "Premium Trial";
    if (subscriptionStatus === "past_due") return "Premium (Past Due)";
    if (subscriptionStatus === "paused") return "Premium (Paused)";
    return "Free";
  };

  const getPlanColor = () => {
    if (subscriptionStatus === "active") return "text-primary";
    if (trialDaysLeft !== null) return "text-yellow-600";
    if (subscriptionStatus === "past_due") return "text-red-500";
    return "text-gray-500";
  };

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const checkout = httpsCallable(functions, "createCheckout");
      const result = await checkout({});
      const data = result.data as { checkoutUrl: string };
      if (data.checkoutUrl) {
        chrome.tabs.create({ url: data.checkoutUrl });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setCheckoutLoading(false);
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
        <h2 className="font-semibold text-xl mb-4">Account</h2>

        <div className="bg-white border rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-gray-500">Current Plan</p>
            <span className={`text-sm font-bold ${getPlanColor()}`}>
              {getPlanLabel()}
            </span>
          </div>

          {trialDaysLeft !== null && (
            <p className="text-xs text-yellow-600 mb-2">
              {trialDaysLeft} {trialDaysLeft === 1 ? "day" : "days"} remaining on your free trial
            </p>
          )}

          {isPremium && (
            <div className="mt-3 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span> Unlimited website blocking
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span> Up to 3 accountability buddies
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span> Category blocking
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span> Full violation history
              </div>
            </div>
          )}

          {!isPremium && (
            <div className="mt-3 space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span> 3 blocked websites
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span> 1 accountability buddy
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-300">✗</span> Category blocking
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-300">✗</span> Full violation history
              </div>
            </div>
          )}
        </div>

        {!isPremium || trialDaysLeft !== null ? (
          <button
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50"
          >
            {checkoutLoading
              ? "Loading..."
              : trialDaysLeft !== null
                ? "Subscribe Now — $5/mo"
                : "Upgrade to Premium — $5/mo"}
          </button>
        ) : (
          <button
            onClick={() => {
              chrome.tabs.create({ url: "https://app.gumroad.com/library" });
            }}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200"
          >
            Manage Subscription
          </button>
        )}

      </div>
    </div>
  );
}

export default Account;
