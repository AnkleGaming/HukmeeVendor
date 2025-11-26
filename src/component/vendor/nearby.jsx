import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { FiSearch, FiMapPin, FiSend } from "react-icons/fi";
import Colors from "../core/constant";
import NearBy from "../../backend/order/nearby";
import InsertHubRequest from "../../backend/order/inserthubrequest"; // ✅ API import

const VendorCard = ({ name, location, distance, onRequest, onLocation }) => {
  return (
    <div className="group flex flex-col items-center transition-all duration-300 hover:scale-[1.03]">
      <Card className="w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl bg-white border border-gray-100 transition-all duration-300">
        <CardContent className="flex flex-col justify-between h-full p-4">
          {/* Image */}

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {name}
            </h4>
            <p className="text-xs text-gray-500 truncate mb-1">{location}</p>
            {distance && (
              <p className="text-[11px] text-orange-500 font-medium">
                {distance.toFixed(2)} km away
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={onRequest}
              className="flex items-center justify-center gap-1 bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-all duration-200 w-[48%]"
            >
              <FiSend size={14} /> Request
            </button>
            <button
              onClick={onLocation}
              className="flex items-center justify-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all duration-200 w-[48%]"
            >
              <FiMapPin size={14} /> Location
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
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  // ✅ Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
      },
      (err) => {
        console.warn("Location access denied:", err);
        setLat("28.6139"); // Default Delhi
        setLon("77.2090");
      }
    );
  }, []);

  // ✅ Fetch nearby vendors automatically every 5s
  useEffect(() => {
    if (!searchTerm.trim()) return;

    let firstLoad = true;

    const fetchVendors = async () => {
      if (firstLoad) setLoading(true);

      try {
        const data = await NearBy({ ProductName: searchTerm, lat, lon });

        // ✅ Only update if data actually changed
        setVendorList((prevList) => {
          const prevString = JSON.stringify(prevList);
          const newString = JSON.stringify(data);
          if (prevString !== newString) {
            return data;
          }
          return prevList; // No change → no re-render → no blink
        });
      } catch (error) {
        console.error("Error loading vendors:", error);
        if (firstLoad) setVendorList([]);
      } finally {
        if (firstLoad) setLoading(false);
        firstLoad = false;
      }
    };

    fetchVendors();
    const interval = setInterval(fetchVendors, 5000);
    return () => clearInterval(interval);
  }, [searchTerm, lat, lon]);

  // ✅ Handle vendor request
  const handleVendorRequest = async (vendor) => {
    try {
      const VendorPhone = localStorage.getItem("userPhone") || "9999999999";
      const response = await InsertHubRequest({
        HubLoginID: vendor.LoginID,
        VendorPhone: VendorPhone,
        itemID: vendor.InventoryID,
        itemName: vendor.ProductName,
        itemQTY: vendor.Quantity,
      });

      console.log("InsertHubRequest Response:", response);
      alert(`Request sent to ${vendor.hubName}!`);
    } catch (err) {
      console.error("InsertHubRequest failed:", err);
      alert("Failed to send request. Try again.");
    }
  };

  // ✅ Handle map open
  const handleOpenMap = (vendor) => {
    const latitude =
      vendor.lat || vendor.Lat || vendor.latitude || vendor.Latitude || "0";
    const longitude =
      vendor.lon ||
      vendor.long ||
      vendor.longitude ||
      vendor.Longitude ||
      vendor.lOG ||
      "0";

    if (latitude && longitude && latitude !== "0" && longitude !== "0") {
      window.open(
        `https://www.google.com/maps?q=${latitude},${longitude}`,
        "_blank"
      );
    } else if (vendor.LocationLink) {
      window.open(vendor.LocationLink, "_blank");
    } else {
      alert("Location coordinates not available for this vendor.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 py-10 bg-gray-50 min-h-screen">
      {/* 🔍 Search bar */}
      {/* 🔍 Search bar with Search Button */}
      <div className="max-w-md w-full mb-6">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-orange-400 transition-all duration-300">
          <FiSearch className="text-gray-400 mr-2" size={20} />

          <input
            type="text"
            placeholder="Search nearby shops or products..."
            className="flex-grow outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Search Button */}
          <button
            onClick={() => setSearchTerm(searchTerm.trim())}
            className="ml-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* 🛍️ Vendors grid */}
      <div className="w-full max-w-6xl bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: Colors.primaryMain }}
        >
          Nearby Hubs
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-full h-[240px] bg-gray-200 animate-pulse rounded-2xl"
              ></div>
            ))}
          </div>
        ) : vendorList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {vendorList.map((vendor, i) => (
              <VendorCard
                key={i}
                name={vendor.hubName}
                location={vendor.Location}
                distance={vendor.DistanceKm}
                onRequest={() => handleVendorRequest(vendor)}
                onLocation={() => handleOpenMap(vendor)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No nearby hubs found. Try searching for another product.
          </p>
        )}
      </div>
    </div>
  );
};

export default NearbyScreen;
