import { useState } from "react";
import { motion } from "framer-motion";
import COLORS from "../core/constant"; // Adjust path as needed

const TabBar = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("accepted");

  const tabs = [
    { id: "accepted", label: "Accepted" },
    { id: "onservice", label: "On Service" },
    { id: "completed", label: "Completed" },
    { id: "Cancelled", label: "Cancelled" },
    { id: "Pending", label: "Pending" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="relative mb-8 px-2 sm:px-0">
      {/* Glassmorphic Container */}
      <div className="relative backdrop-blur-xl bg-white/80 border border-white/30 rounded-2xl shadow-lg p-2 overflow-hidden">
        {/* Scrollable Tab Container */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex-shrink-0 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap
                  ${
                    isActive
                      ? "text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Select ${tab.label} tab`}
                style={{ zIndex: 10 }}
              >
                {/* Active Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${COLORS.primaryFrom} ${COLORS.primaryTo}`}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                {/* Tab Label */}
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Optional: Subtle Bottom Glow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-gradient-to-t from-orange-300/20 to-transparent blur-3xl pointer-events-none" />
    </div>
  );
};

export default TabBar;
