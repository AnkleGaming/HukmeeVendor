import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import spaImage from "../../assets/facialimg.png";
import GetProduct from "../../backend/getproduct/getproduct";
import GetProductImage from "../../backend/getproduct/getproductimage";
import { AlertCircle, ShoppingCart } from "lucide-react";
import SearchCard from "./searchcard";

const ProductScreen = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchServicesWithImages = async () => {
      try {
        setIsLoading(true);
        const products = await GetProduct();

        if (!products || products.length === 0) {
          setServices([]);
          setFilteredServices([]);
          return;
        }

        const productsWithImages = await Promise.all(
          products.map(async (product) => {
            try {
              const images = await GetProductImage(product.ProID);
              return {
                ...product,
                imageUrl: images.length > 0 ? images[0].productImage : spaImage,
              };
            } catch (err) {
              console.error(
                `Error fetching image for product ${product.ProID}:`,
                err
              );
              return { ...product, imageUrl: spaImage };
            }
          })
        );

        setServices(productsWithImages);
        setFilteredServices(productsWithImages);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicesWithImages();
  }, []);

  // Filter services based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((service) =>
        service.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchTerm, services]);

  // Handle service click
  const handleServiceClick = (service) => {
    navigate("/productmainpage", { state: { subService: service } });
  };

  // Skeleton card
  const SkeletonCard = () => (
    <Card className="flex flex-col h-[360px] rounded-lg shadow-lg border animate-pulse">
      <CardContent className="p-0 flex-grow">
        <div className="h-[200px] bg-gray-200 rounded-t-lg"></div>
      </CardContent>
      <div className="mt-3 px-4 py-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </Card>
  );

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
    <section
      id="services"
      className="py-12 bg-gradient-to-b from-blue-50 to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Search Card */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-[30px] font-semibold text-gray-900 tracking-tight">
              Explore Our Products
            </h2>
            <div className="w-20 h-1 bg-indigo-600 rounded-full mt-2" />
          </div>
          <div className="w-full md:w-1/3">
            <SearchCard
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              aria-label="Search products"
            />
          </div>
          <motion.div
            className="w-full md:w-auto flex items-center gap-2 text-gray-800 hover:text-indigo-600 cursor-pointer transition-colors duration-200"
            onClick={() => navigate("/cartpage")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View cart"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="font-medium">Cart</span>
          </motion.div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center mb-8 text-red-600 bg-red-50 p-4 rounded-lg shadow-sm"
          >
            <AlertCircle className="mr-2" size={24} />
            <span className="text-lg font-medium">{error}</span>
          </motion.div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {isLoading ? (
            Array(5)
              .fill()
              .map((_, index) => <SkeletonCard key={index} />)
          ) : filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <motion.div
                key={service.ProID}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className="flex flex-col h-[360px] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-300 cursor-pointer group"
                  onClick={() => handleServiceClick(service)}
                  aria-label={`View ${service.ProductName} details`}
                >
                  <CardContent className="p-0 flex-grow">
                    <div className="h-[200px] overflow-hidden rounded-t-lg">
                      <img
                        src={service.imageUrl || spaImage}
                        alt={service.ProductName || "Product"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = spaImage;
                        }}
                      />
                    </div>
                  </CardContent>
                  <div className="px-4 py-4 flex flex-col flex-grow">
                    <span className="text-lg font-semibold text-gray-900 truncate block leading-tight mb-2">
                      {service.ProductName}
                    </span>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {service.ProductDes}
                    </p>
                    <span className="text-base font-medium text-gray-900 mt-auto">
                      ₹{Number(service.Price).toFixed(2) || "0.00"}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="col-span-full text-center text-gray-600 py-12"
            >
              <p className="text-xl font-medium">
                No products available at this time.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductScreen;
