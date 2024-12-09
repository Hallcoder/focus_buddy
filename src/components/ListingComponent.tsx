import React, { useState, useRef, useEffect } from "react";
import { SlOptionsVertical } from "react-icons/sl";

interface ListingComponentProps {
  title: string;
  subTitle: string;
  type: "buddy" | "url"; // Type of the listing (buddy or url)
  onEdit?: () => void;   // Callback for edit action
  onRemove?: () => void; // Callback for remove action
  onViewDetails?: () => void; // Callback for viewing details (buddies only)
  onSendNotification?: () => void; // Callback for sending notifications (buddies only)
}

function ListingComponent({
  title,
  subTitle,
  type,
  onEdit,
  onRemove,
  onViewDetails,
  onSendNotification
}: ListingComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Toggle the visibility of the popout menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close the menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Conditional menu options based on type
  const renderMenuOptions = () => {
    if (type === "buddy") {
      return (
        <>
          <button
            onClick={() => {
              onEdit && onEdit();
              setMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onRemove && onRemove();
              setMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Remove
          </button>
          <button
            onClick={() => {
              onViewDetails && onViewDetails();
              setMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            View Details
          </button>
          <button
            onClick={() => {
              onSendNotification && onSendNotification();
              setMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Send Notification
          </button>
        </>
      );
    } else if (type === "url") {
      return (
        <>
          <button
            onClick={() => {
              onEdit && onEdit();
              setMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onRemove && onRemove();
              setMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Remove
          </button>
        </>
      );
    }
  };

  return (
    <div className="relative flex justify-between items-center border m-2 p-1 rounded-md">
      <span className="flex flex-col">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-primary">{subTitle}</p>
      </span>

      {/* Icon for the three dots */}
      <span className="relative" ref={menuRef}>
        <button
          className="focus:outline-none hover:bg-gray-200 p-1 rounded-full"
          onClick={toggleMenu}
        >
          <SlOptionsVertical className="text-gray-500 hover:text-gray-700" />
        </button>

        {/* Popout Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-md z-10">
            {renderMenuOptions()}
          </div>
        )}
      </span>
    </div>
  );
}

export default ListingComponent;
