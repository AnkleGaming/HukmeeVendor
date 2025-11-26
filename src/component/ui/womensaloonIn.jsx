import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SelectServiceCardSection from "./select-service";
import PackageMain from "./package-card";
import CartPage from "./cartpage";
import CartSummary from "./cartsummury";
import GetOrderid from "../../backend/order/getorderid";
import InsertOrder from "../../backend/order/insertorder";
import LoginCard from "./loginCard";
import OtpVerification from "./otpverification";

const WomenSaloonIn = () => {
  const location = useLocation();
  const { subService } = location.state || {};

  const [cartItems, setCartItems] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);
  const [selectedServiceTab, setSelectedServiceTab] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);
  const [pendingPhone, setPendingPhone] = useState("");
  const loginPromptRef = useRef(null);
  const loginCardRef = useRef(null);
  const otpModalRef = useRef(null);
  const [orderType, setOrderType] = useState(null);
  const UserID = localStorage.getItem("userPhone");
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
      setIsLaptop(width >= 1024);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

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

  useEffect(() => {
    const fetchExistingOrder = async () => {
      try {
        if (!UserID) return;

        const orders = await GetOrderid(UserID, "Pending");

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

  const [servicePackages, setServicePackages] = useState([]);
  const fetchPackages = useCallback(async () => {
    if (!selectedServiceTab?.SubCatid) return;
    try {
      const data = await import(
        "../../backend/servicepack/getservicepack"
      ).then((mod) => mod.default(selectedServiceTab.SubCatid));
      setServicePackages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    }
  }, [selectedServiceTab]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const addToCart = async (item) => {
    if (!UserID) {
      setPendingCartItem(item);
      setShowLogin(true);
      return;
    }

    if (orderType === "Product") {
      setShowCart(true);
      return;
    }

    const price = parseInt(item.discountfee || item.fees || 0);

    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1, price }];
      }
    });

    try {
      let currentOrderId = orderId;
      if (!currentOrderId) {
        currentOrderId = `ORD${Date.now()}`;
        setOrderId(currentOrderId);
        setOrderType("Service");
        console.log("Generated new order:", currentOrderId);
      }

      const orderPayload = {
        OrderID: currentOrderId,
        UserID: UserID,
        OrderType: "Service",
        ItemImages: "",
        ItemName: item.servicename || "",
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

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const calculateTotal = () =>
    cartItems.reduce(
      (acc, i) => acc + parseInt(i.discountfee || i.fees || 0) * i.quantity,
      0
    );

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

  return (
    <div className="mt-[55px] px-4 md:px-6 lg:px-[120px] md:mt-[100px] lg:mt-[130px]">
      <div className="flex flex-col md:flex-row lg:flex-row gap-4 lg:gap-6 h-full">
        <div className="flex flex-col gap-4 flex-shrink-0">
          <SelectServiceCardSection
            subService={subService}
            selectedSubService={selectedServiceTab}
            onChangeSubService={(newTab) => setSelectedServiceTab(newTab)}
          />

          {isMobile && (
            <PackageMain
              addToCart={addToCart}
              selectedServiceTab={selectedServiceTab}
            />
          )}

          {isTablet && (
            <CartPage
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              calculateTotal={calculateTotal}
            />
          )}
        </div>

        <div className="flex-grow max-h-[calc(100vh-200px)] overflow-y-auto hide-scrollbar px-[1px] sm:px-[1px]">
          {!isMobile && (
            <PackageMain
              addToCart={addToCart}
              selectedServiceTab={selectedServiceTab}
            />
          )}
        </div>

        {isLaptop && (
          <div className="mt-[30px] lg:block flex-shrink-0">
            <CartPage
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              calculateTotal={calculateTotal}
            />
          </div>
        )}
      </div>

      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full z-50 block lg:hidden">
          <CartSummary total={calculateTotal()} cartItems={cartItems} />
        </div>
      )}

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
        {showCart && orderType === "Product" && (
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
                    Product Cart Pending!
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    You need to Finish or Delete from Cart.
                  </p>
                  <div className="flex gap-4">
                    <motion.button
                      onClick={() => {
                        setShowCart(false);
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
                      Product Cart Pending!
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      You need to Finish or Delete from Cart.
                    </p>
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => {
                          navigate("/cartpage");
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Proceed to login"
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

export default WomenSaloonIn;
