import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import spaImage from "../../assets/facialimg.png";
import GetProductImage from "../../backend/getproduct/getproductimage";
import SuggestProductScreen from "./suggestedproduct";
import RatingScreen from "./ratingscreen";
import GetProductReviews from "../../backend/getproduct/getproductreviews";
import InsertOrder from "../../backend/order/insertorder";
import GetOrder from "../../backend/order/getorderid";
import LoginCard from "./loginCard";
import OtpVerification from "./otpverification";

const ProductMainPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const product = location.state?.subService;
  const [cartItems, setCartItems] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);
  const [pendingPhone, setPendingPhone] = useState("");
  const loginPromptRef = useRef(null);
  const loginCardRef = useRef(null);
  const otpModalRef = useRef(null);

  const UserID = localStorage.getItem("userPhone");

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      if (!product?.ProID) {
        setImages([spaImage]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const fetchedImages = await GetProductImage(product.ProID);

        if (Array.isArray(fetchedImages) && fetchedImages.length > 0) {
          const mapped = fetchedImages.map(
            (img) => img.productImage || spaImage
          );
          setImages(mapped);
        } else {
          setImages([spaImage]);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([spaImage]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, [product]);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  useEffect(() => {
    const fetchExistingOrder = async () => {
      try {
        if (!UserID) return;

        const orders = await GetOrder(UserID, "Pending");

        if (orders && orders.length > 0) {
          setOrderId(orders[0].OrderID);
          setOrderType(orders[0].OrderType);
          console.log(
            "Existing order found:",
            orders[0].OrderID,
            orders[0].OrderType
          );
        } else {
          setOrderId(null);
          setOrderType(null);
          console.log("No existing order, will generate new one on first add");
        }
      } catch (err) {
        console.error("GetOrderid failed:", err);
      }
    };
    fetchExistingOrder();
  }, [UserID]);

  useEffect(() => {
    if (!instanceRef.current || isLoading) return;
    const autoplay = setInterval(() => {
      instanceRef.current?.next();
    }, 4000);
    return () => clearInterval(autoplay);
  }, [instanceRef, isLoading]);

  useEffect(() => {
    const fetchReview = async () => {
      if (!product?.ProID) {
        setReviews([]);
        return;
      }
      try {
        const fetchedReviews = await GetProductReviews(product.ProID);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
    };
    fetchReview();
  }, [product]);

  useEffect(() => {
    if (!showLogin || !loginPromptRef.current) return;
    const modalElement = loginPromptRef.current;
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    modalElement.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();
    return () => modalElement.removeEventListener("keydown", handleKeyDown);
  }, [showLogin]);

  useEffect(() => {
    if (!showLoginCard || !loginCardRef.current) return;
    const modalElement = loginCardRef.current;
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    modalElement.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();
    return () => modalElement.removeEventListener("keydown", handleKeyDown);
  }, [showLoginCard]);

  useEffect(() => {
    if (!showOtpModal || !otpModalRef.current) return;
    const modalElement = otpModalRef.current;
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    modalElement.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();
    return () => modalElement.removeEventListener("keydown", handleKeyDown);
  }, [showOtpModal]);

  useEffect(() => {
    if (showLogin || showLoginCard || showOtpModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [showLogin, showLoginCard, showOtpModal]);

  const addToCart = async (item) => {
    if (!UserID) {
      setPendingCartItem(item);
      setShowLogin(true);
      return;
    }

    if (orderType === "Service") {
      setShowCart(true);
      return;
    }

    const price = parseInt(item.Price || 0);

    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.ProID);
      if (exists) {
        return prev.map((i) =>
          i.id === item.ProID ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, id: item.ProID, quantity: 1, price }];
      }
    });

    try {
      let currentOrderId = orderId;
      if (!currentOrderId) {
        currentOrderId = `ORD${Date.now()}`;
        setOrderId(currentOrderId);
        setOrderType("Product");
        console.log("Generated new order:", currentOrderId);
      }

      const orderPayload = {
        OrderID: currentOrderId,
        UserID: UserID,
        OrderType: "Product",
        ItemImages: "",
        ItemName: item.ProductName || "",
        Price: price.toString(),
        Quantity: "1",
        Address: "",
        Slot: "",
        SlotDatetime: "",
        OrderDatetime: new Date().toISOString(),
      };

      await InsertOrder(orderPayload);
      console.log("InsertOrder API successful");

      window.location.reload();
    } catch (err) {
      console.error("InsertOrder failed:", err);
    }
  };

  const handleLoginSubmit = (phoneNumber) => {
    setPendingPhone(phoneNumber);
    setShowLogin(false);
    setShowLoginCard(false);
    setShowOtpModal(true);
  };

  const handleOtpSuccess = async (verifiedPhone) => {
    localStorage.setItem("userPhone", verifiedPhone);
    localStorage.setItem("isLoggedIn", "true");
    setShowOtpModal(false);

    if (pendingCartItem) {
      await addToCart(pendingCartItem);
      setPendingCartItem(null);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const bottomSheetVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-600">No product details found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 bg-white shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
        <div className="md:w-1/2 w-full h-[400px] bg-gray-100 rounded-2xl overflow-hidden relative">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-gray-600">Loading images...</p>
            </div>
          ) : images.length > 1 ? (
            <>
              <div ref={sliderRef} className="keen-slider w-full h-full">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="keen-slider__slide flex items-center justify-center bg-gray-100"
                  >
                    <img
                      src={img}
                      alt={`${product.ProductName} - Image ${index + 1}`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = spaImage;
                      }}
                    />
                  </div>
                ))}
              </div>
              {loaded && instanceRef.current && (
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                  <button
                    onClick={() => instanceRef.current?.prev()}
                    className="p-2 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition"
                    aria-label="Previous slide"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => instanceRef.current?.next()}
                    className="p-2 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition"
                    aria-label="Next slide"
                  >
                    ›
                  </button>
                </div>
              )}
              {loaded && instanceRef.current && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => instanceRef.current?.moveToIdx(index)}
                      className={`w-3 h-3 rounded-full ${
                        currentSlide === index
                          ? "bg-indigo-600"
                          : "bg-gray-300 hover:bg-gray-400"
                      } transition`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <img
              src={images[0] || spaImage}
              alt={product.ProductName}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = spaImage;
              }}
            />
          )}
        </div>
        <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {product.ProductName}
            </h2>
            <p className="text-gray-600 mt-4 text-sm md:text-base leading-relaxed">
              {product.ProductDes}
            </p>
          </div>
          <div className="mt-6">
            <p className="text-xl md:text-2xl font-semibold text-gray-900">
              ₹{Number(product.Price).toFixed(2)}
            </p>
            <button
              onClick={() => addToCart(product)}
              className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              aria-label="Add to cart"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="p-1 mt-8">
        <RatingScreen reviews={reviews} />
      </div>
      <div className="p-1 mt-8">
        <SuggestProductScreen />
      </div>
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
            ref={loginPromptRef}
            aria-modal="true"
            role="dialog"
          >
            {isMobile ? (
              <motion.div
                variants={bottomSheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed bottom-0 left-0 right-0 w-full h-[50vh] bg-white rounded-t-2xl shadow-2xl p-6 max-w-md mx-auto pointer-events-auto"
              >
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-2"
                  onClick={() => setShowLogin(false)}
                  aria-label="Close login prompt"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Login Required
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    You need to log in to add items to your cart.
                  </p>
                  <div className="flex gap-4">
                    <motion.button
                      onClick={() => {
                        setShowLogin(false);
                        setShowLoginCard(true);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Proceed to login"
                    >
                      Log In
                    </motion.button>
                    <motion.button
                      onClick={() => setShowLogin(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Return to browsing"
                    >
                      Return
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center justify-center h-full"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full pointer-events-auto">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-2"
                    onClick={() => setShowLogin(false)}
                    aria-label="Close login prompt"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="flex flex-col items-center text-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                      Login Required
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      You need to log in to add items to your cart.
                    </p>
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => {
                          setShowLogin(false);
                          setShowLoginCard(true);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Proceed to login"
                      >
                        Log In
                      </motion.button>
                      <motion.button
                        onClick={() => setShowLogin(false)}
                        className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Return to browsing"
                      >
                        Return
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCart && orderType === "Service" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
            ref={loginPromptRef}
            aria-modal="true"
            role="dialog"
          >
            {isMobile ? (
              <motion.div
                variants={bottomSheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed bottom-0 left-0 right-0 w-full h-[50vh] bg-white rounded-t-2xl shadow-2xl p-6 max-w-md mx-auto pointer-events-auto"
              >
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-2"
                  onClick={() => setShowCart(false)}
                  aria-label="Close cart prompt"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Service Cart Pending!
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    You need to Finish or Delete from Cart.
                  </p>
                  <div className="flex gap-4">
                    <motion.button
                      onClick={() => {
                        setShowCart(false);
                        navigate("/cartpage");
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Go to cart"
                    >
                      Cart
                    </motion.button>
                    <motion.button
                      onClick={() => setShowCart(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Return to browsing"
                    >
                      Return
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center justify-center h-full"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full pointer-events-auto">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-2"
                    onClick={() => setShowCart(false)}
                    aria-label="Close cart prompt"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="flex flex-col items-center text-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                      Service Cart Pending!
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      You need to Finish or Delete from Cart.
                    </p>
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => {
                          setShowCart(false);
                          navigate("/cartpage");
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Go to cart"
                      >
                        Cart
                      </motion.button>
                      <motion.button
                        onClick={() => setShowCart(false)}
                        className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Return to browsing"
                      >
                        Return
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showLoginCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
            ref={loginCardRef}
            aria-modal="true"
            role="dialog"
          >
            {isMobile ? (
              <motion.div
                variants={bottomSheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed bottom-0 left-0 right-0 w-full h-[70vh] bg-white rounded-t-2xl shadow-2xl p-6 max-w-md mx-auto pointer-events-auto"
              >
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <LoginCard
                  onClose={() => setShowLoginCard(false)}
                  onSubmit={handleLoginSubmit}
                />
              </motion.div>
            ) : (
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center justify-center h-full"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full pointer-events-auto">
                  <LoginCard
                    onClose={() => setShowLoginCard(false)}
                    onSubmit={handleLoginSubmit}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
            ref={otpModalRef}
            aria-modal="true"
            role="dialog"
          >
            {isMobile ? (
              <motion.div
                variants={bottomSheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed bottom-0 left-0 right-0 w-full h-[70vh] bg-white rounded-t-2xl shadow-2xl p-6 max-w-md mx-auto pointer-events-auto"
              >
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <OtpVerification
                  phone={pendingPhone}
                  onSuccess={handleOtpSuccess}
                  onClose={() => setShowOtpModal(false)}
                />
              </motion.div>
            ) : (
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center justify-center h-full"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full pointer-events-auto">
                  <OtpVerification
                    phone={pendingPhone}
                    onSuccess={handleOtpSuccess}
                    onClose={() => setShowOtpModal(false)}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductMainPage;
