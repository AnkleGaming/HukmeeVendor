import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import GetSubCategory from "../../backend/homepageimage/getcategory";
import SearchCard from "../ui/searchcard";

// Reusable ServiceCard component
const ServiceCard = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group cursor-pointer flex flex-col items-center space-y-3 transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-xl"
      aria-label={`Select ${label} service`}
    >
      <Card className="w-[90px] h-[90px] sm:w-[130px] sm:h-[130px] md:w-[90px] md:h-[90px] lg:w-[90px] lg:h-[90px] rounded-xl overflow-hidden border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-0 flex items-center justify-center w-full h-full">
          <img
            src={icon}
            alt={label}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
            onError={(e) => {
              e.target.src = "/fallback-service-image.png";
            }}
          />
        </CardContent>
      </Card>
      <span className="text-sm sm:text-base font-medium text-gray-900 text-center max-w-[130px] leading-tight group-hover:text-indigo-600 transition-colors duration-300">
        {label}
      </span>
    </button>
  );
};

const ServiceCardSection = ({ onServiceSelect }) => {
  const [serviceList, setServiceList] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Detect mobile
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await GetSubCategory();
        setServiceList(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-6 md:px-8 lg:px-12 font-sans bg-gray-50 py-8">
      <div className="w-full max-w-7xl">
        <div className="mb-6">{isMobile && <SearchCard />}</div>

        <div className="bg-white border border-gray-300 rounded-[8px] w-full py-6 px-4 sm:px-6 transition-all duration-300 ">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            What are you looking for?
          </h3>

          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4 justify-center">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-3 animate-pulse"
                >
                  <div className="w-[90px] h-[90px] sm:w-[130px] sm:h-[130px] rounded-xl bg-gray-200"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-h-[450px] sm:max-h-[550px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-50 p-3 sm:p-5">
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 justify-center ">
                {serviceList.map((service) => (
                  <ServiceCard
                    key={service.id}
                    icon={`https://api.weprettify.com/Images/${service.ServiceImage}`}
                    label={service.ServiceName}
                    onClick={() => onServiceSelect(service)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCardSection;
