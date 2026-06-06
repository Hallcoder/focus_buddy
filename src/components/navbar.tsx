import { useState, useRef, useEffect } from "react";
import { MdSupervisorAccount, MdHistory } from "react-icons/md";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import profile from "../assets/profile.jpeg";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex w-full justify-between p-2 items-center">
      <img src={logo} className="h-10 w-20" alt="Logo" />
      <div className="flex items-center gap-3">
        <span onClick={() => navigate("/violation-history")} className="cursor-pointer" title="Violation History">
          <MdHistory className="text-gray-500 text-xl" />
        </span>
        <span onClick={() => navigate("/monitoring")} className="cursor-pointer" title="Monitoring">
          <MdSupervisorAccount className="text-gray-500 text-xl" />
        </span>
        <div className="relative" ref={menuRef}>
          <img
            src={profile}
            className="h-8 w-8 rounded-full cursor-pointer border-2 border-transparent hover:border-primary transition-colors"
            alt="Profile"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg py-1 w-44 z-50">
              <button
                onClick={() => { setMenuOpen(false); navigate("/account"); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Account
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate("/account"); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Billing & Plan
              </button>
              <button
                onClick={() => { setMenuOpen(false); chrome.tabs.create({ url: "https://focusbuddy.web.app" }); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Visit Website
              </button>
              <div className="border-t my-1"></div>
              <button
                onClick={async () => {
                  setMenuOpen(false);
                  try {
                    await auth.signOut();
                    toast.success("Logged out.");
                    navigate("/login");
                  } catch (err) {
                    toast.error("Failed to log out.");
                  }
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
