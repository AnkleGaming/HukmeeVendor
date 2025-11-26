import React, { useState, useEffect } from "react";
import { Star, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceCard from "./ui/service-card";
import MainImage from "./ui/image-grid";
import WomensSalonCard from "./ui/womensaloonCard";
import MobileHeader from "./ui/mobileheader";
import SpecialForYou from "./ui/specialyforyou";

const HeroSection = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setActiveModal("category");
  };

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Blurred Background on Modal */}
      <div
        className={`${
          activeModal ? "blur-sm pointer-events-none" : ""
        } transition-all duration-300`}
      >
        {/* Hero Main Section */}
        <section
          id="home"
          className="flex flex-col lg:flex-row items-center justify-between w-full px- lg:px-28 py-4 lg:py-24"
        >
          {/* Left */}
          <div className="w-full lg:w-[95%] flex flex-col items-center lg:items-start text-center lg:text-left gap-1 ">
            {isMobile && <MobileHeader />}
            <ServiceCard onServiceSelect={handleServiceClick} />
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-[95%] flex justify-center mt-5 lg:mt-0">
            <div className="w-[90vw] lg:w-full max-w-[540px]">
              <MainImage />
            </div>
          </div>
        </section>

        {/* Services Carousel */}
        {/* <section className="min-h-screen">
          <SpecialForYou />
        </section> */}

        {/* Stats */}
        {/* <section className="w-full flex justify-center mt-6">
          <div className="flex flex-col sm:flex-row gap-10 lg:gap-32 text-center">
            <div className="flex flex-col items-center">
              <Star className="h-7 w-7 text-yellow-500 mb-2" />
              <h3 className="text-2xl lg:text-3xl font-bold">4.8</h3>
              <p className="text-sm lg:text-base text-gray-600">
                Service Rating*
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-7 w-7 text-blue-500 mb-2" />
              <h3 className="text-2xl lg:text-3xl font-bold">100K+</h3>
              <p className="text-sm lg:text-base text-gray-600">
                Customers Globally*
              </p>
            </div>
          </div>
        </section> */}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeModal === "category" && (
          <motion.div
            key="modal-category"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <WomensSalonCard
                onClose={() => setActiveModal(null)}
                service={selectedService}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroSection;
