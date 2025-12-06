import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../component/Footer";
import MyOrder from "../component/vendor/orderedscreen";
import TabBar from "../component/vendor/tab";
import AcceptedScreen from "../component/vendor/orderedscreen";
import PendingScreen from "../component/vendor/pendingscreen";
import DeclinedScreen from "../component/vendor/declinedscreen";
import COLORS from "../component/core/constant";
import LoginCard from "../component/ui/loginCard.jsx";
import Popupcard from "../component/vendor/popupcard.jsx";
import OtpVerification from "../component/ui/otpverification.jsx";
import GetUser from "../backend/authentication/getuser.js";
import VendorVerification from "../component/ui/verification.jsx";
import UpdateCurrentLocations from "../backend/updatelocation/updatelocation.js";
import ShowLeads from "../backend/order/showleads.js";
import OnService from "../component/vendor/onservice.jsx";
import CompletedScreen from "../component/vendor/completed.jsx";
import CanceledScreen from "../component/vendor/canceled.jsx";

// Hook to track window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: undefined });
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth });
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
};

const Index = () => {
  const [selectedTab, setSelectedTab] = useState("accepted");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPopupCard, setShowPopupCard] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [user, setUser] = useState([]);
  const [pendingPhone, setPendingPhone] = useState("");
  const loginModalRef = useRef(null);
  const otpModalRef = useRef(null);

  const { width } = useWindowSize();
  const isMobile = width < 640;

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const mobile = localStorage.getItem("userPhone");

  // Render tab content
  const renderContent = () => {
    switch (selectedTab) {
      case "accepted":
        return <AcceptedScreen />;

      case "onservice":
        return <OnService />;

      case "declined":
        return <DeclinedScreen />;

      case "completed":
        return <CompletedScreen />;

      case "Cancelled": // UPDATED ✔️
        return <CanceledScreen />;

      default:
        return null;
    }
  };

  // Handle login modal open
  const handleLoginClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowLoginModal(true);
    }, 500);
  };

  const shownLeadIds = new Set();
  let isPopupCurrentlyOpen = false; // This prevents any reset while popup is open

  useEffect(() => {
    if (!isLoggedIn || !mobile || isPopupCurrentlyOpen) return;

    const fetchLeads = async () => {
      // Don't do anything if popup is already open
      if (isPopupCurrentlyOpen) return;

      try {
        const leads = await ShowLeads(mobile, "Pending");

        const unseenLeads = Array.isArray(leads)
          ? leads.filter(
              (lead) => lead?.OrderID && !shownLeadIds.has(lead.OrderID)
            )
          : [];

        if (unseenLeads.length > 0) {
          const nextLead = unseenLeads[0];
          shownLeadIds.add(nextLead.OrderID);

          console.log("New lead shown:", nextLead.OrderID);

          // Mark popup as open
          isPopupCurrentlyOpen = true;

          setPopupData(nextLead);
          setShowPopupCard(true);
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    fetchLeads();
    const interval = setInterval(fetchLeads, 5000);

    return () => clearInterval(interval);
  }, [isLoggedIn, mobile]); // No dependency on showPopupCard!

  // Update vendor location every 5 seconds
  useEffect(() => {
    if (!isLoggedIn || !mobile) return;

    const updateLocation = async () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation not supported by browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log("📍 Current Location:", latitude, longitude);

          try {
            const res = await UpdateCurrentLocations({
              VendorPhone: mobile,
              Lat: latitude,
              Lon: longitude,
            });
            console.log("✅ Location updated:", res);
          } catch (error) {
            console.error("❌ Error updating location:", error);
          }
        },
        (error) => console.warn("⚠️ Location access denied:", error.message)
      );
    };

    updateLocation();
    const interval = setInterval(updateLocation, 5000);
    return () => clearInterval(interval);
  }, [isLoggedIn, mobile]);

  // Lock background scroll when modals are open
  useEffect(() => {
    const active = showLoginModal || showOtpModal || showPopupCard;
    document.body.classList.toggle("overflow-hidden", active);
    return () => document.body.classList.remove("overflow-hidden");
  }, [showLoginModal, showOtpModal, showPopupCard]);

  // Fetch user details
  useEffect(() => {
    if (!mobile) return;
    const fetchUser = async () => {
      try {
        const data = await GetUser(mobile);
        console.log("User fetched:", data);
        setUser(data || []);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [mobile]);

  // Handle login submit → show OTP modal
  const handleLoginSubmit = (phoneNumber) => {
    setIsProcessing(true);
    setTimeout(() => {
      setPendingPhone(phoneNumber);
      setShowLoginModal(false);
      setShowOtpModal(true);
      setIsProcessing(false);
    }, 500);
  };

  // Handle OTP success
  const handleOtpSuccess = (verifiedPhone) => {
    localStorage.setItem("userPhone", verifiedPhone);
    localStorage.setItem("isLoggedIn", "true");
    setShowOtpModal(false);
    window.location.reload();
  };

  // Popup close handler
  const handlePopupClose = () => {
    setShowPopupCard(false);
    setPopupData(null);

    // Allow new popups again after current one is fully closed
    setTimeout(() => {
      isPopupCurrentlyOpen = false;
    }, 500); // Small delay to prevent race condition
  };

  const handleCancel = () => {
    // localStorage.removeItem("isLoggedIn");
    // localStorage.removeItem("userPhone");
    // setIsLoggedIn(false);
    // navigate("/");
    setShowCancelModal(true);
  };

  useEffect(() => {
    const openLoginModal = () => {
      setShowLoginModal(true);
      setShowOtpModal(false);
    };

    window.addEventListener("open-login-modal", openLoginModal);

    return () => {
      window.removeEventListener("open-login-modal", openLoginModal);
    };
  }, []);

  // Modal variants
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

  // If not logged in
  if (!isLoggedIn) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${COLORS.bgGray} px-4`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <h2
            className={`text-2xl sm:text-3xl font-bold ${COLORS.textGrayDark} mb-4`}
          >
            You’re not logged in
          </h2>
          <p className={`${COLORS.textMuted} mb-8 text-sm sm:text-base`}>
            To access your profile and start using all features, please log in.
          </p>
          <button
            onClick={handleLoginClick}
            disabled={isProcessing}
            className={`px-8 py-3 text-lg font-semibold bg-gradient-to-r ${
              COLORS.gradientFrom
            } ${COLORS.gradientTo} ${COLORS.textWhite} rounded-xl shadow-lg ${
              COLORS.hoverFrom
            } ${COLORS.hoverTo} transition-all duration-300 ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                Processing...
              </div>
            ) : (
              "Get Started"
            )}
          </button>
        </motion.div>

        {/* Login Modal */}
        <AnimatePresence>
          {showLoginModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
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
                  ref={loginModalRef}
                >
                  <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                  <LoginCard
                    onSubmit={handleLoginSubmit}
                    onClose={() => setShowLoginModal(false)}
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
                  ref={loginModalRef}
                >
                  <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full pointer-events-auto">
                    <LoginCard
                      onSubmit={handleLoginSubmit}
                      onClose={() => setShowLoginModal(false)}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* OTP Verification Modal */}
        <AnimatePresence>
          {showOtpModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
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
                  ref={otpModalRef}
                >
                  <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                  <OtpVerification
                    phoneNumber={pendingPhone}
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
                  ref={otpModalRef}
                >
                  <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full pointer-events-auto">
                    <OtpVerification
                      phoneNumber={pendingPhone}
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
  }

  // Main vendor view
  return (
    <>
      {user[0]?.verified === "approved" ? (
        <div className="min-h-screen py-10 mt-5">
          <section className="relative p-[1px]">
            <TabBar onTabChange={setSelectedTab} />
            <div className="mt-6">
              <Suspense fallback={<div>Loading...</div>}>
                {renderContent()}
              </Suspense>
            </div>
          </section>
          {/* <footer className="mt-8 bg-gray-100 z-10 md:hidden">
            <Footer />
          </footer> */}
        </div>
      ) : (
        <VendorVerification />
      )}

      {/* Popup Card (for new leads) */}
      <AnimatePresence>
        {showPopupCard && popupData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
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
                <Popupcard data={popupData} onClose={handlePopupClose} />
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
                <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full pointer-events-auto">
                  <Popupcard data={popupData} onClose={handlePopupClose} />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
