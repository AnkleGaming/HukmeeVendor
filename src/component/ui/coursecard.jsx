import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, color } from "framer-motion";
import GetServicePack from "../../backend/servicepack/getservicepack";
import Colors from "../core/constant";

// Package Card Component
const PackageCardItem = ({
  image,
  servicename,
  duration,
  fees,
  discountfee,
  pkg,
}) => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate("/joincourses", { state: { course: pkg } });
  };

  return (
    <motion.div
      className="group w-full max-w-xs rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      aria-label={`View ${servicename} course details`}
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={servicename}
          className="w-full h-40 sm:h-48 md:h-52 lg:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className={`absolute top-2 right-2 bg-${Colors.primaryMain} text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm`}
        >
          {duration}
        </div>
        {discountfee && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
            Save ₹{Number(fees - discountfee).toFixed(0)}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight line-clamp-2">
          {servicename}
        </h2>

        <div className="flex items-center gap-2 text-sm font-medium">
          <span className={`text-${Colors.primaryMain} text-base font-bold`}>
            ₹{discountfee || fees}
          </span>
          {discountfee && (
            <span className="line-through text-gray-500 text-xs">₹{fees}</span>
          )}
        </div>

        <motion.button
          onClick={handleJoinClick}
          className={`w-full px-4 py-2 bg-${Colors.primaryMain} text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Join ${servicename} course`}
        >
          Join
        </motion.button>
      </div>
    </motion.div>
  );
};

// Course Card List
const CourseCard = () => {
  const [servicePackages, setServicePackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const data = await GetServicePack("2");
        setServicePackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className={`w-full bg-orange-50 p-5 `}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-6 md:mb-8 text-left tracking-tight">
            Explore Our Courses
          </h1>
        </motion.div>

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center items-center h-32 md:h-40"
              aria-live="polite"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="ml-3 text-gray-600 text-base md:text-lg">
                Loading Courses...
              </p>
            </motion.div>
          ) : servicePackages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="text-center text-gray-500 text-base md:text-lg py-10 bg-white rounded-xl shadow-md"
            >
              No Courses available at the moment.
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {servicePackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <PackageCardItem {...pkg} pkg={pkg} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CourseCard;
