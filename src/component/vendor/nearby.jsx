import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "../ui/card";
import { FiSearch, FiMapPin, FiSend } from "react-icons/fi";
import Colors from "../core/constant";
import NearBy from "../../backend/order/nearby";
import InsertHubRequest from "../../backend/order/inserthubrequest";

const VendorCard = ({ name, location, distance, onRequest, onLocation }) => {
  return (
    <div className="group transition-all duration-300 hover:scale-[1.02]">
      <Card className="w-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl bg-white border border-gray-100 transition-all duration-300">
        <CardContent className="p-5 space-y-4">
          {/* Hub Name & Location */}
          <div>
            <h4 className="font-bold text-lg text-gray-900 truncate">{name}</h4>
            <p className="text-sm text-gray-600 truncate mt-1">{location}</p>
            {distance !== undefined && distance !== null && (
              <p className="text-xs font-semibold text-orange-600 mt-2">
                {parseFloat(distance).toFixed(2)} km away
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onRequest}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm py-3 rounded-xl hover:shadow-lg transition-all"
            >
              <FiSend size={16} />
              Request Stock
            </button>
            <button
              onClick={onLocation}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold text-sm py-3 rounded-xl hover:bg-gray-200 transition-all"
            >
              <FiMapPin size={16} />
              View Map
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const NearbyScreen = ({ onVendorSelect }) => {
  const [vendorList, setVendorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(""); // For live typing
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  // Get user location once
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (error) => {
          console.warn("Location denied, using default:", error);
          setLat(28.6139); // Delhi
          setLon(77.209);
        }
      );
    } else {
      setLat(28.6139);
      setLon(77.209);
    }
  }, []);

  // Fetch vendors when search term changes
  const fetchVendors = useCallback(async () => {
    if (!searchTerm.trim() || lat === null || lon === null) {
      setVendorList([]);
      return;
    }

    setLoading(true);
    try {
      const data = await NearBy({
        ProductName: searchTerm.trim(),
        lat,
        lon,
      });

      // Prevent unnecessary re-renders
      setVendorList((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(data || [])) {
          return prev;
        }
        return data || [];
      });
    } catch (error) {
      console.error("Failed to fetch nearby hubs:", error);
      setVendorList([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, lat, lon]);

  // Initial fetch + auto-refresh every 8 seconds when searching
  useEffect(() => {
    fetchVendors(); // First load

    if (!searchTerm.trim()) return;

    const interval = setInterval(fetchVendors, 8000); // Refresh every 8s
    return () => clearInterval(interval);
  }, [fetchVendors]);

  // Handle search submit
  const handleSearch = () => {
    setSearchTerm(inputValue.trim());
  };

  // Handle vendor request
  const handleVendorRequest = async (vendor) => {
    try {
      const VendorPhone = localStorage.getItem("userPhone") || "9999999999";

      const response = await InsertHubRequest({
        HubLoginID: vendor.LoginID,
        VendorPhone,
        itemID: vendor.InventoryID,
        itemName: vendor.ProductName,
        itemQTY: vendor.Quantity,
      });

      if (response) {
        alert(`Request sent successfully to ${vendor.hubName}!`);
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("Failed to send request. Please try again.");
    }
  };

  // Open location in maps
  const handleOpenMap = (vendor) => {
    let latitude =
      vendor.lat || vendor.Lat || vendor.latitude || vendor.Latitude;
    let longitude =
      vendor.lon ||
      vendor.long ||
      vendor.longitude ||
      vendor.Longitude ||
      vendor.lOG;

    if (latitude && longitude) {
      window.open(
        `https://www.google.com/maps?q=${latitude},${longitude}`,
        "_blank"
      );
    } else if (vendor.LocationLink) {
      window.open(vendor.LocationLink, "_blank");
    } else {
      alert("Location not available for this hub.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="flex items-center border-2 border-gray-300 rounded-2xl px-4 py-3 bg-white shadow-md focus-within:border-orange-500 focus-within:shadow-lg transition-all">
                <FiSearch className="text-gray-500 mr-3" size={22} />
                <input
                  type="text"
                  placeholder="Search products or shops nearby..."
                  className="flex-1 outline-none text-gray-800 font-medium placeholder-gray-400"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={!inputValue.trim()}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Search
            </button>
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-3xl font-bold text-center mb-8"
          style={{ color: Colors.primaryMain }}
        >
          Nearby Vendor Hubs
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-64 animate-pulse shadow-lg"
              >
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && vendorList.length === 0 && searchTerm && (
          <div className="text-center py-16">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
            <p className="text-xl font-medium text-gray-600">
              No hubs found nearby
            </p>
            <p className="text-gray-500 mt-2">
              Try searching for common items like "oil", "rice", etc.
            </p>
          </div>
        )}

        {!loading && vendorList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vendorList.map((vendor, i) => (
              <VendorCard
                key={`${vendor.LoginID}-${i}`}
                name={vendor.hubName || "Unknown Hub"}
                location={vendor.Location || "Location not available"}
                distance={vendor.DistanceKm}
                onRequest={() => handleVendorRequest(vendor)}
                onLocation={() => handleOpenMap(vendor)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyScreen;
