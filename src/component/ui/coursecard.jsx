import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GetCourse from "../../backend/joincourse/getcourse";
import Colors from "../core/constant";

const imageBaseUrl = "https://api.hukmee.in/";
const fallbackImage = "https://via.placeholder.com/400x300?text=Course+Image";

const PackageCardItem = ({
  Image,
  ServiceName,
  duration,
  Fees,
  DiscountFees,
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
    >
      <div className="relative overflow-hidden">
        <img
          src={Image || fallbackImage}
          alt={ServiceName}
          className="w-full h-40 sm:h-48 md:h-52 lg:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = fallbackImage)}
        />
        {duration && (
          <div
            className={`absolute top-2 right-2 bg-${Colors.primaryMain} text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm`}
          >
            {duration} Minute
          </div>
        )}
        {DiscountFees && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
            Save ₹{Number(Fees - DiscountFees).toFixed(0)}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight line-clamp-2">
          {ServiceName}
        </h2>

        <div className="flex items-center gap-2 text-sm font-medium">
          <span className={`text-${Colors.primaryMain} text-base font-bold`}>
            ₹{Fees}
          </span>
          {DiscountFees && (
            <span className="line-through text-gray-500 text-xs">
              ₹{DiscountFees}
            </span>
          )}
        </div>

        <motion.button
          onClick={handleJoinClick}
          className={`w-full px-4 py-2 bg-${Colors.primaryMain} text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Join
        </motion.button>
      </div>
    </motion.div>
  );
};

const CourseCard = () => {
  const [servicePackages, setServicePackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const data = await GetCourse();

        if (Array.isArray(data)) {
          const updatedData = data.map((pkg) => ({
            ...pkg,
            Image: pkg.Image ? `${imageBaseUrl}${pkg.Image}` : fallbackImage,
          }));
          setServicePackages(updatedData);
        } else {
          console.error("Unexpected response:", data);
          setServicePackages([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-gray-50 p-5">
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
