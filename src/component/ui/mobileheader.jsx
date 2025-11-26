import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GetOrder from "../../backend/order/getorderid";

const CartWithBadge = ({ count }) => (
  <div
    className="relative cursor-pointer transition-transform hover:scale-110 group"
    aria-label={`Shopping cart with ${count} items`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 text-gray-800 group-hover:text-gray-600 transition-colors"
      viewBox="0 0 24 24"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>

    {count > 0 && (
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
        {count > 99 ? "99+" : count}
      </div>
    )}
  </div>
);

const MobileHeader = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(true);
  const userID = localStorage.getItem("userPhone");
  const [userAddress, setUserAddress] = useState("Loading address...");

  // Fetch cart data
  useEffect(() => {
    const fetchOrder = async () => {
      if (!userID) {
        setCartCount(0);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await GetOrder(userID, "Pending");

        if (response && typeof response === "object") {
          if ("items" in response && Array.isArray(response.items)) {
            setCartCount(response.items.length);
          } else if (Array.isArray(response)) {
            setCartCount(response.length);
          } else {
            setCartCount(0);
          }
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setCartCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [userID]);

  // Fetch user address
  useEffect(() => {
    const fetchUserAddress = async () => {
      if (!userID) {
        setUserAddress("Please set your address");
        setAddressLoading(false);
        return;
      }

      try {
        setAddressLoading(true);
        // Mock address API - replace with your actual implementation
        const addressResponse = await fetchUserAddressAPI(userID);

        if (addressResponse && addressResponse.address) {
          setUserAddress(
            addressResponse.address.length > 50
              ? addressResponse.address.substring(0, 50) + "..."
              : addressResponse.address
          );
        } else {
          setUserAddress(
            "546, Block 2, Kirti Nagar Industrial Area, Kirti Nagar, New Delhi, Delhi, India"
          );
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setUserAddress("Unable to load address");
      } finally {
        setAddressLoading(false);
      }
    };

    fetchUserAddress();
  }, [userID]);

  // Mock function for address API - replace with your actual implementation
  const fetchUserAddressAPI = async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          address:
            "546, Block 2, Kirti Nagar Industrial Area, Kirti Nagar, New Delhi, Delhi, India",
        });
      }, 1000);
    });
  };

  return (
    <header className="w-full rounded-[10px] border-b border-gray-300 flex items-center justify-between px-4 py-3 bg-inherit sm:px-6 sm:py-4 sticky top-0 z-50">
      {/* Left Section - Home and Address */}
      <div className="flex flex-col flex-1 min-w-0">
        <h1 className="text-base font-semibold text-gray-900 sm:text-lg text-left">
          Home
        </h1>
        <div
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 mt-0.5 max-w-[85%] sm:max-w-[90%] focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="546, Block 2, Kirti Nagar Industrial Area, Kirti Nagar, New Delhi, Delhi, India"
          aria-label="Change delivery address"
        >
          <span className="truncate font-medium">
            546, Block 2, Kirti Nagar Industrial Area, Kirti Nagar, New Delhi,
            Delhi, India
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Right Section - Cart Button */}
      <button
        onClick={() => navigate("/cartpage")}
        className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Go to cart with ${cartCount} items`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        ) : (
          <CartWithBadge count={cartCount} />
        )}
      </button>
    </header>
  );
};

export default MobileHeader;
