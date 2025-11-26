import React from "react";

const ServicePromoCard = ({ title, subtitle, image }) => {
  return (
    <div className="m-2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      <div
        className="relative w-full h-[200px] sm:h-[225px] md:h-[250px] lg:h-[280px] xl:h-[300px] rounded-xl overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3 sm:p-4 flex flex-col justify-end text-white">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg md:text-xl font-bold">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs sm:text-sm md:text-base">{subtitle}</p>
            )}
          </div>
          <button className="mt-2 sm:mt-3 bg-white text-black text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-md w-max hover:bg-gray-200 transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicePromoCard;
