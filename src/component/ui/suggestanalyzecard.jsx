import React, { useEffect, useState } from "react";
import GetSkinAnalyzer from "../../backend/getskinanalyzer/skinanalyzer";

// Package card component
const PackageCardItem = ({ item, onAdd }) => {
  const { Image, ServiceName, duration, Fees, DiscountFees } = item;

  return (
    <div className="relative w-full max-w-[400px] sm:max-w-[350px] md:max-w-[500px] lg:max-w-[550px] rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={Image || "https://via.placeholder.com/550x200"}
          alt={ServiceName}
          className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/550x200";
          }}
        />
        <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
          {duration}
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 space-y-3">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 tracking-tight line-clamp-2">
          {ServiceName}
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-indigo-700 text-base sm:text-lg md:text-xl font-bold">
            ₹{Number(DiscountFees || Fees).toFixed(2)}
          </span>
          {DiscountFees && (
            <span className="line-through text-gray-400 text-xs sm:text-sm md:text-base">
              ₹{Number(Fees).toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={() => onAdd(item)}
          className="w-full py-2 sm:py-2.5 bg-indigo-600 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label={`Add ${ServiceName} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// Suggested Analyzer Card Component
const SuggestedAnalyzecard = ({ addToCart }) => {
  const [servicePackages, setServicePackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await GetSkinAnalyzer();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received.");
        }
        setServicePackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setError("Failed to load suggested packages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="w-full bg-gradient-to-b py-3 sm:py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
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
            No suggested packages available at the moment.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {servicePackages.map((pkg) => (
              <PackageCardItem key={pkg.id} item={pkg} onAdd={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedAnalyzecard;
