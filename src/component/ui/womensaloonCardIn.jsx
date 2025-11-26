import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import img1 from "../../assets/facemask.png";
import { i } from "framer-motion/client";

// ✅ Services data with priceLevel, tag, and brands
const services = [
  {
    icon: img1,
    label: "Salon for Women",
    priceLevel: "₹₹₹",
    tag: "LUXURY",
    brands: ["AINHOA", "CASMARA", "CIRÉPIL"],
    mobilePath: "/womensaloonInMobile",
    desktopPath: "/WomenSaloonIn",
  },
  {
    icon: img1,
    label: "Spa for Women",
    priceLevel: "₹₹",
    tag: "PREMIUM",
    brands: ["Forest Essentials", "VLCC"],
    mobilePath: "/womensaloonInMobile",
    desktopPath: "/WomenSaloonIn",
  },
  {
    icon: img1,
    label: "Makeup Studio",
    priceLevel: "₹₹₹",
    tag: "LUXURY",
    brands: ["MAC", "Sephora", "Kiko"],
    mobilePath: "/womensaloonInMobile",
    desktopPath: "/WomenSaloonIn",
  },
];

// ✅ Card Component
const WomensCardIn = ({ icon, label, priceLevel, tag, brands, onClick }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex items-center gap-4 bg-white p-4 rounded-xl shadow hover:shadow-md transition w-full"
    >
      {/* Image */}
      <img
        src={icon}
        alt={label}
        className="w-[50px] h-[50px] rounded-lg object-cover"
      />

      {/* Details */}
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-black">{label}</h3>

        <div className="flex items-center gap-2 mt-1">
          <span className="bg-gray-100 text-xs font-semibold px-2 py-1 rounded-md">
            {priceLevel}
          </span>
          <span className="bg-gray-100 text-xs font-semibold px-2 py-1 rounded-md">
            {tag}
          </span>
        </div>

        <div className="text-sm text-gray-500 mt-2 font-medium tracking-wide">
          {brands.join("  |  ")}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="text-gray-400" />
    </div>
  );
};

// ✅ Modal Card Wrapper
const WomensSalonCard = ({ onClose }) => {
  const navigate = useNavigate();
  // const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   const checkScreen = () => {
  //     setIsMobile(window.innerWidth < 640 ? true : false);
  //   };
  //   checkScreen();
  //   window.addEventListener("resize", checkScreen);
  //   return () => {
  //     window.removeEventListener("resize", checkScreen);
  //   };
  // }, []);

  return (
    <div className="bg-white rounded-[5px] p-[20px] w-full max-w-xl relative z-50">
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-center">
        Women's Salon & Spa
      </h2>

      {/* Grid of Cards */}
      <div className="flex flex-col gap-4">
        {services.map((service, index) => (
          <WomensCardIn
            key={index}
            icon={service.icon}
            label={service.label}
            priceLevel={service.priceLevel}
            tag={service.tag}
            brands={service.brands}
            onClick={() => {
              navigate(service.desktopPath);
              if (onClose) onClose();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WomensSalonCard;
