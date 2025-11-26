import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import GetSubCategory from "../../backend/subcategory/getsubcategory";

const WomensCard = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-xl"
      aria-label={`Select ${label} service`}
    >
      <Card className="w-[90px] h-[90px] sm:w-[140px] sm:h-[140px] md:w-[90px] md:h-[90px] lg:w-[90px] lg:h-[90px] rounded-xl overflow-hidden border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all duration-300 group-hover:ring-2 group-hover:ring-indigo-200">
        <CardContent className="p-0 flex items-center justify-center w-full h-full">
          <img
            src={icon}
            alt={label}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = "/fallback-service-image.png"; // fallback image
            }}
          />
        </CardContent>
      </Card>
      <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center max-w-[140px] leading-tight group-hover:text-indigo-600 transition-colors duration-300">
        {label}
      </span>
    </button>
  );
};

const WomensSalonCard = ({ onClose, service }) => {
  const navigate = useNavigate();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await GetSubCategory(service.id, "SubCategory");
      setLoading;
      setSubServices(data);
      setLoading(false);
    };
    fetchData();
  }, [service]);

  const handleServiceClick = (subService) => {
    navigate("/womensaloonIn", {
      state: { subService },
    });
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 sm:p-6 w-full h-[400px] max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl relative shadow-xl z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-10">
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={20} className="stroke-2" />
      </button>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 tracking-tight">
        {service?.ServiceName || "Invalid Service Name"}
      </h2>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-32 sm:h-40">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="ml-2 sm:ml-3 text-gray-500 text-sm sm:text-base">
            Loading sub-services...
          </p>
        </div>
      ) : (
        /* Sub-services Grid */
        <div className="h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] overflow-y-auto hide-scrollbar p-2 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4">
            {subServices.map((subService) => (
              <WomensCard
                key={subService.id}
                icon={`https://api.weprettify.com/Images/${subService.image}`}
                label={subService.text}
                onClick={() => handleServiceClick(subService)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WomensSalonCard;
