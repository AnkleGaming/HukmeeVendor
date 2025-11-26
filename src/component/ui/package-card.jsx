import React, { useEffect, useState, useCallback } from "react";
import GetServicePack from "../../backend/servicepack/getservicepack";

const PackageCardItem = ({
  image,
  servicename,
  duration,
  fees,
  discountfee,
  onAdd,
  refreshPackages, // ✅ refetch packages after add
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClick = async () => {
    setIsAdding(true);
    try {
      // Simulate network delay between 2-3 seconds
      const delay = Math.floor(Math.random() * 1000) + 2000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      await onAdd(); // Add to cart
      refreshPackages?.(); // ✅ Refresh package list after adding
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative w-full max-w-[400px] sm:max-w-[350px] md:max-w-[500px] lg:max-w-[550px] rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={image || "https://via.placeholder.com/550x200"}
          alt={servicename}
          className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
          {duration}
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 space-y-3">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 tracking-tight line-clamp-2">
          {servicename}
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-indigo-700 text-base sm:text-lg md:text-xl font-bold">
            ₹{discountfee || fees}
          </span>
          {discountfee && (
            <span className="line-through text-gray-400 text-xs sm:text-sm md:text-base">
              ₹{fees}
            </span>
          )}
        </div>

        <button
          onClick={handleAddClick}
          disabled={isAdding}
          className="w-full py-2 sm:py-2.5 bg-indigo-600 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center gap-2"
          aria-label={`Add ${servicename} to cart`}
        >
          {isAdding && (
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
          )}
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

const PackageCard = ({ addToCart, selectedServiceTab }) => {
  const [servicePackages, setServicePackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPackages = useCallback(async () => {
    if (!selectedServiceTab?.SubCatid) return;
    setLoading(true);
    setError(null);
    try {
      const data = await GetServicePack(selectedServiceTab.SubCatid);
      setServicePackages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError("Failed to load packages. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedServiceTab]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return (
    <div className="w-full bg-gradient-to-b border border-b-1 border-gray-300 rounded-[8px] py-8 sm:py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-10 tracking-tight">
          Explore Our Service Packages
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40 sm:h-48 md:h-56">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="ml-2 sm:ml-3 text-gray-600 text-base sm:text-lg">
              Loading packages...
            </p>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 text-base sm:text-lg py-8 sm:py-10 bg-white rounded-2xl shadow-md">
            {error}
          </p>
        ) : servicePackages.length === 0 ? (
          <p className="text-center text-gray-500 text-base sm:text-lg py-8 sm:py-10 bg-white rounded-2xl shadow-md">
            No packages available at the moment.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {servicePackages.map((pkg) => (
              <PackageCardItem
                key={pkg.id}
                {...pkg}
                onAdd={() => addToCart(pkg)}
                refreshPackages={fetchPackages} // ✅ pass callback
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageCard;
