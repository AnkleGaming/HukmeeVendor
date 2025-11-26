import React, { useState } from "react";
import Home from "../pages/Index";
import SkinAnalyzer from "./ui/skinanalyzer";
import Services from "../pages/Index";
import ProductScreen from "./ui/products";
import Nearby from "./vendor/nearby";
import UserProfile from "./ui/userprofile";
import { MdNearMe } from "react-icons/md";

const navItems = [
  {
    label: "HM",
    icon: (
      <div className="text-[10px] w-8 h-8 bg-gradient-to-br from-[#FA7D09] to-[#E56A00] text-white flex items-center justify-center rounded-full font-bold text-lg transition-all duration-300 group-hover:scale-110">
        HM
      </div>
    ),
    component: <Home />,
    notification: false,
  },
  {
    label: "Nearby hubs",
    icon: (
      <div className="text-[10px] w-8 h-8 bg-gradient-to-br from-[#FA7D09] to-[#E56A00] text-white flex items-center justify-center rounded-full font-bold text-lg transition-all duration-300 group-hover:scale-110">
        <MdNearMe size={15} />
      </div>
    ),
    component: <Nearby />,
    notification: false,
  },
  {
    label: "Profile",
    icon: (
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110">
        👤
      </div>
    ),
    component: <UserProfile />,
    notification: false,
  },
];

const MobileNavbar = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-4 pb-20"
        style={{ maxHeight: "calc(100vh - 80px)" }}
      >
        {navItems[activeTab].component}
      </div>

      {/* Bottom Navbar */}
      <nav
        className="fixed bottom-0 left-0 w-full h-17 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-[0_-6px_15px_rgba(0,0,0,0.1)] flex justify-around items-center z-50 transition-all duration-500"
        aria-label="Mobile navigation"
      >
        {navItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(index)}
            className={`group flex flex-col items-center justify-center relative w-1/4 py-2 transition-all duration-300 hover:bg-indigo-50/70 rounded-xl ${
              activeTab === index ? "text-indigo-700" : "text-gray-600"
            }`}
            aria-label={`${item.label} tab`}
            aria-current={activeTab === index ? "page" : undefined}
          >
            <div className="relative flex items-center justify-center">
              {item.icon}
              {item.notification && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </div>
            <span
              className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                activeTab === index ? "font-semibold text-[#FA7D09]" : ""
              } group-hover:text-indigo-700`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavbar;
