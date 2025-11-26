import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import GetServicesTab from "../../backend/selectservices/getservicestab";

// Individual service card
const SelectServiceCard = ({ label, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105"
    >
      <Card
        className={`w-[60px] h-[60px] md:w-[70px] md:h-[70px] lg:w-[60px] lg:h-[60px] rounded-xl overflow-hidden border flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300
        ${
          isActive
            ? "bg-indigo-100 border-indigo-400 ring-2 ring-indigo-300"
            : "bg-white border-gray-200 hover:border-indigo-300"
        }`}
      >
        <CardContent className="p-0 flex items-center justify-center w-full h-full">
          <span className="text-sm font-bold text-indigo-700 group-hover:text-indigo-900 transition-colors duration-300">
            {label[0]}
          </span>
        </CardContent>
      </Card>
      <span className="text-[10px] md:text-[11px] lg:text-[12px] font-medium text-center text-gray-800 leading-tight max-w-[80px] group-hover:text-indigo-600 transition-colors duration-300">
        {label}
      </span>
    </div>
  );
};

// Main component
const SelectServiceCardSection = ({
  subService,
  onChangeSubService,
  selectedSubService,
}) => {
  const [getServiceTab, setGetServiceTab] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false); // <-- Add expand state

  useEffect(() => {
    const fetchServiceTab = async () => {
      if (!subService?.serviceId) return;

      try {
        setLoading(true);
        const data = await GetServicesTab(subService.serviceId);
        setGetServiceTab(data || []);
        console.log("Fetched services:", data);

        // Select the first service by default if none is selected
        if (data && data.length > 0 && !selectedSubService) {
          onChangeSubService(data[0]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceTab();
  }, [subService, selectedSubService, onChangeSubService]);

  return (
    <div className="w-full sm:w-[350px] md:w-[300px] lg:w-[280px] mx-auto sm:mx-0 bg-white rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300">
      <h1 className="text-[22px] md:text-[26px] lg:text-[28px] font-bold mb-2 text-gray-900 tracking-tight">
        {subService?.text || "Salon Luxe"}
      </h1>

      {/* Description with expand/collapse */}
      <div className="mb-4">
        <p
          className={`text-[12px] md:text-[14px] lg:text-[15px] text-gray-600 mb-2 transition-all duration-300 ${
            isExpanded ? "" : "line-clamp-3 overflow-hidden"
          }`}
        >
          {subService?.description || "No description available"}
        </p>

        {subService?.description &&
          subService?.description.length > 100 && ( // Only show if long text
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-indigo-600 text-sm font-medium hover:underline"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white p-4 border border-gray-200 rounded-lg w-full overflow-hidden shadow-sm">
        <h2 className="text-[13px] font-semibold mb-4 text-gray-900">
          Select a service
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="ml-2 text-sm text-gray-500">Loading services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-3 gap-x-3 gap-y-4 md:gap-x-4 md:gap-y-5">
            {getServiceTab.map((service) => (
              <SelectServiceCard
                key={service.id || service.Tabname}
                label={service.Tabname}
                isActive={selectedSubService?.id === service.id}
                onClick={() => onChangeSubService(service)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectServiceCardSection;
