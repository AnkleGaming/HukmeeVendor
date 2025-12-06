import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "../ui/card";
import { FiSearch, FiMapPin, FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Colors from "../core/constant";
import NearBy from "../../backend/order/nearby";
import InsertHubRequest from "../../backend/order/inserthubrequest";

const VendorCard = ({ name, location, distance, onRequest, onLocation }) => {
  return (
    <div className="group transition-all duration-300 hover:scale-[1.02]">
      <Card className="w-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl bg-white border border-gray-100 transition-all duration-300">
        <CardContent className="p-5 space-y-4">
          <div>
            <h4 className="font-bold text-lg text-gray-900 truncate">{name}</h4>
            <p className="text-sm text-gray-600 truncate mt-1">{location}</p>
            {distance !== undefined && distance !== null && (
              <p className="text-xs font-semibold text-orange-600 mt-2">
                {parseFloat(distance).toFixed(2)} km away
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onRequest}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm py-3 rounded-xl hover:shadow-lg transition-all"
            >
              <FiSend size={16} />
              Send Request
            </button>
            <button
              onClick={onLocation}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold text-sm py-3 rounded-xl hover:bg-gray-200 transition-all"
            >
              <FiMapPin size={16} />
              Map
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
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Only show skeleton on first load
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  // Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        () => {
          setLat(28.6139); // Default: Delhi
          setLon(77.209);
        }
      );
    } else {
      setLat(28.6139);
      setLon(77.209);
    }
  }, []);

  // Fetch vendors smoothly
  const fetchVendors = useCallback(async () => {
    if (!searchTerm.trim() || lat === null || lon === null) {
      setVendorList([]);
      return;
    }

    if (isInitialLoad) setLoading(true);

    try {
      const data = await NearBy({
        ProductName: searchTerm.trim(),
        lat,
        lon,
      });

      // Deep compare to prevent unnecessary re-renders
      setVendorList((prev) => {
        const prevIds = prev.map((v) => `${v.LoginID}-${v.DistanceKm}`);
        const newIds = (data || []).map((v) => `${v.LoginID}-${v.DistanceKm}`);
        if (JSON.stringify(prevIds) === JSON.stringify(newIds)) return prev;
        return data || [];
      });
    } catch (error) {
      console.error("Failed to fetch nearby hubs:", error);
      setVendorList([]);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [searchTerm, lat, lon, isInitialLoad]);

  // Auto-refresh every 8 seconds when searching
  useEffect(() => {
    fetchVendors();

    if (!searchTerm.trim()) return;

    const interval = setInterval(fetchVendors, 8000);
    return () => clearInterval(interval);
  }, [fetchVendors]);

  const handleSearch = () => {
    setSearchTerm(inputValue.trim());
    setIsInitialLoad(true); // Show skeleton again when user searches new term
  };

  const handleVendorRequest = async (vendor) => {
    try {
      const VendorPhone = localStorage.getItem("userPhone") || "9999999999";
      await InsertHubRequest({
        HubLoginID: vendor.LoginID,
        VendorPhone,
        itemID: vendor.InventoryID,
        itemName: vendor.ProductName,
        itemQTY: vendor.Quantity,
      });
      alert(`Request sent to ${vendor.hubName}!`);
    } catch (err) {
      console.error(err);
      alert("Failed to send request.");
    }
  };

  const handleOpenMap = (vendor) => {
    const lat = vendor.lat || vendor.Lat || vendor.latitude || vendor.Latitude;
    const lng =
      vendor.lon ||
      vendor.long ||
      vendor.longitude ||
      vendor.Longitude ||
      vendor.lOG;

    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    } else if (vendor.LocationLink) {
      window.open(vendor.LocationLink, "_blank");
    } else {
      alert("Location not available");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto mt-7">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center border-2 border-gray-300 rounded-2xl px-5 py-4 bg-white shadow-md focus-within:border-orange-500 focus-within:shadow-xl transition-all">
                <FiSearch className="text-gray-500 mr-3" size={24} />
                <input
                  type="text"
                  placeholder="Search products or shops nearby..."
                  className="flex-1 outline-none text-gray-800 font-medium text-base placeholder-gray-400"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={!inputValue.trim()}
              className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Search
            </button>
          </div>
        </div>

        <h2
          className="text-3xl font-bold text-center mb-10"
          style={{ color: Colors.primaryMain }}
        >
          Nearby Hubs
        </h2>

        {/* First Load Skeleton */}
        {loading && isInitialLoad && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-64 animate-pulse shadow-lg"
              >
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded-xl mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Smooth Refreshing Indicator (no skeleton!) */}
        {loading && !isInitialLoad && (
          <div className="fixed top-4 right-4 z-50 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-gray-200">
              <div className="w-5 h-5 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-700">
                Updating nearby hubs...
              </span>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && vendorList.length === 0 && searchTerm && (
          <div className="text-center py-20">
            <div className="bg-gray-100 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6"></div>
            <p className="text-2xl font-semibold text-gray-700">
              No hubs found nearby
            </p>
            <p className="text-gray-500 mt-3">
              Try searching for "Samsung", "Vivo", "Oppo", etc.
            </p>
          </div>
        )}

        {/* Results with Smooth Animation */}
        <AnimatePresence mode="wait">
          {vendorList.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {vendorList.map((vendor) => (
                <motion.div
                  key={`${vendor.LoginID}-${vendor.DistanceKm}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <VendorCard
                    name={vendor.hubName || "Unknown Hub"}
                    location={vendor.Location || "Location not available"}
                    distance={vendor.DistanceKm}
                    onRequest={() => handleVendorRequest(vendor)}
                    onLocation={() => handleOpenMap(vendor)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NearbyScreen;
