import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaMinus,
  FaCamera,
  FaTimes,
  FaEllipsisV,
} from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import PersonalDetails from "./personalDetailsh.jsx";
import GetUser from "../../backend/authentication/getuser.js";
import TermsPage from "./terms&condition.jsx";
import AboutUs from "./aboutus.jsx";
import PrivacyAndPolicy from "./privacy&policy.jsx";
import { useNavigate } from "react-router-dom";
import LoginCard from "./loginCard.jsx";
import OtpVerification from "./otpverification.jsx";
import TransactionHistory from "./transactions.jsx";
import UpdateVendor from "../../backend/authentication/updatevendor.js";
import COLORS from "../core/constant";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: undefined });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
};

const UserProfile = () => {
  const phone = localStorage.getItem("userPhone");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [openSections, setOpenSections] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [user, setUser] = useState([]);
  const [preview, setPreview] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pendingPhone, setPendingPhone] = useState("");
  const [activeTab, setActiveTab] = useState("pending"); // State for TabBar
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const loginModalRef = useRef(null);
  const otpModalRef = useRef(null);
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 640;
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (showLoginModal || showOtpModal || showUploadModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [showLoginModal, showOtpModal, showUploadModal]);

  // Focus trap for login modal
  useEffect(() => {
    if (!showLoginModal || !loginModalRef.current) return;
    const modalElement = loginModalRef.current;
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
  }, [showLoginModal]);

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

  // Focus trap for upload modal
  useEffect(() => {
    if (!showUploadModal) return;
    const modalElement = document.querySelector(".upload-modal");
    if (!modalElement) return;
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
  }, [showUploadModal]);

  // Fetch user data
  useEffect(() => {
    if (!isLoggedIn || !phone) return;
    const fetchUser = async () => {
      try {
        const fetchedUser = await GetUser(phone);
        setUser(fetchedUser || []);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [phone, isLoggedIn]);

  // Handle click outside for menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("userPhone");
    localStorage.removeItem("isLoggedIn");
    setShowMenu(false);
    navigate("/");
  };

  const handleLog = () => {
    // localStorage.removeItem("isLoggedIn");
    // localStorage.removeItem("userPhone");
    // setIsLoggedIn(false);
    // navigate("/");
    setShowLogoutModal(true);
  };

  const handleLoginClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowLoginModal(true);
    }, 500);
  };

  const handleLoginSubmit = (phoneNumber) => {
    setIsProcessing(true);
    setTimeout(() => {
      setPendingPhone(phoneNumber);
      setShowLoginModal(false);
      setShowOtpModal(true);
      setIsProcessing(false);
    }, 500);
  };

  const handleOtpSuccess = (verifiedPhone) => {
    localStorage.setItem("userPhone", verifiedPhone);
    localStorage.setItem("isLoggedIn", "true");
    setShowOtpModal(false);
    window.location.reload();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = () => {
        setBase64Image(
          reader.result.replace(/^data:image\/[a-zA-Z]+;base64,/, "")
        );
        setPreview(reader.result);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("⚠️ Error reading the selected image.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!base64Image) {
      alert("⚠️ Please select an image before saving.");
      return;
    }
    console.log("image is ", base64Image);

    setIsUploading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const res = await UpdateVendor("", "", phone, "", "", base64Image);

      if (res) {
        setProgress(100);
        setTimeout(() => {
          setUser((prev) =>
            prev.map((u, i) => (i === 0 ? { ...u, Image: base64Image } : u))
          );
          alert("✅ Profile image updated successfully!");
          setShowUploadModal(false);
          setAvatar(null);
          setBase64Image(null);
          setPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }, 500);
        window.location.reload();
      } else {
        alert("❌ Failed to update image.");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("❌ Error updating profile image.");
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setAvatar(null);
    setBase64Image(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sections = [
    { id: 1, title: "Personal Details", Component: <PersonalDetails /> },
    { id: 2, title: "Wallet & Transaction", Component: <TransactionHistory /> },
    { id: 3, title: "About Us", Component: <AboutUs /> },
    { id: 4, title: "Terms & Conditions", Component: <TermsPage /> },
    { id: 5, title: "Privacy Policy", Component: <PrivacyAndPolicy /> },
  ];

  // Animation variants
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

  const sectionVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const avatarVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

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
            To access your profile and start using all features, please log in
            to your account.
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
            aria-label={
              isProcessing ? "Processing login" : "Log in to your account"
            }
            aria-busy={isProcessing}
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

        <AnimatePresence>
          {showLoginModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
              ref={loginModalRef}
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
                    onClose={() => setShowLoginModal(false)}
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
                  <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full pointer-events-auto">
                    <LoginCard
                      onClose={() => setShowLoginModal(false)}
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
                  <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full pointer-events-auto">
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
  }

  return (
    <div className={`min-h-screen ${COLORS.bgGray} p-4 sm:p-6 md:p-8 lg:p-12`}>
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1
              className={`text-[18px] sm:text-3xl font-normal ${COLORS.textGrayDark} tracking-tight`}
            >
              My Profile
            </h1>
            <div className={`w-20 h-1 bg-[#FA7D09] rounded-full mt-2`} />{" "}
            {/* No matching color in COLORS, using fallback */}
          </div>
        </motion.div>

        <motion.div
          variants={avatarVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <motion.div
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#FA7D09] shadow-lg cursor-pointer group`}
            whileHover={{ scale: 1.05 }}
            aria-label="Change profile picture"
          >
            <img
              src={
                user[0]?.VenImg
                  ? `https://api.hukmee.in/Images/${user[0].VenImg}`
                  : "https://via.placeholder.com/150?text=Avatar"
              }
              alt={user[0]?.fullname || "Profile"}
              className="w-full h-full object-cover group-hover:opacity-90 transition-all duration-300"
            />
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => setShowUploadModal(true)}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <FaCamera className={`${COLORS.textWhite} text-xl sm:text-2xl`} />
            </motion.div>
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg sm:text-xl font-semibold ${COLORS.textGrayDark} mt-4`}
          >
            {user[0]?.fullname || "User Profile"}
          </motion.h2>
        </motion.div>

        {/* SECTIONS */}
        <div className="space-y-4 flex flex-col items-center justify-center">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: section.id * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-lg"
            >
              <motion.div
                onClick={() => toggleSection(section.id)}
                className={`p-4 sm:p-5 cursor-pointer flex items-center justify-between bg-gradient-to-r ${COLORS.primaryFrom} ${COLORS.primaryTo} ${COLORS.textWhite} transition-all duration-300 hover:from-[#E56A00] hover:to-[#C75A00]`}
                whileHover={{ scale: 1.01 }}
                aria-label={`Toggle ${section.title} section`}
              >
                <h3 className="text-sm sm:text-base font-semibold tracking-tight">
                  {section.title}
                </h3>
                <motion.div
                  animate={{ rotate: openSections[section.id] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {openSections[section.id] ? (
                    <FaMinus className="text-sm" />
                  ) : (
                    <FaPlus className="text-sm" />
                  )}
                </motion.div>
              </motion.div>

              <AnimatePresence initial={false}>
                {openSections[section.id] && (
                  <motion.div
                    key={`section-${section.id}`}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="p-3 bg-gray-50"
                  >
                    {section.Component}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          <motion.button
            onClick={handleLog}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-[150px] py-3 mt-6 text-center font-semibold rounded-xl 
        bg-gradient-to-r ${COLORS.primaryFrom} ${COLORS.primaryTo} ${COLORS.textWhite} 
        hover:from-[#E56A00] hover:to-[#C75A00] 
        active:scale-95 transition-all duration-300`}
          >
            <div className="flex items-center justify-center gap-2">
              <IoMdLogOut size={25} />
              <span>Logout</span>
            </div>
          </motion.button>
        </div>

        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 pointer-events-auto upload-modal"
              aria-modal="true"
              role="dialog"
              aria-busy={isUploading}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl pointer-events-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-lg sm:text-xl font-semibold ${COLORS.textGrayDark}`}
                  >
                    Upload Profile Picture
                  </h2>
                  <motion.button
                    onClick={handleCancelUpload}
                    className={`${COLORS.textGray} hover:${COLORS.textMuted} transition-colors`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close upload modal"
                    disabled={isUploading}
                  >
                    <FaTimes className="text-lg" />
                  </motion.button>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden mb-6 ${COLORS.borderGray} shadow-sm`}
                  >
                    <img
                      src={
                        preview ||
                        base64Image ||
                        "https://via.placeholder.com/150?text=Preview"
                      }
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <motion.button
                    onClick={() => fileInputRef.current.click()}
                    className={`bg-gradient-to-r ${COLORS.gradientFrom} ${
                      COLORS.gradientTo
                    } ${COLORS.textWhite} font-semibold py-2 px-6 rounded-lg ${
                      COLORS.hoverFrom
                    } ${COLORS.hoverTo} transition-all duration-200 ${
                      isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    whileHover={{ scale: isUploading ? 1 : 1.05 }}
                    whileTap={{ scale: isUploading ? 1 : 0.95 }}
                    aria-label="Choose image file"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                        Uploading...
                      </div>
                    ) : (
                      "Choose Image"
                    )}
                  </motion.button>
                  {base64Image && (
                    <div className="mt-4 w-full">
                      <motion.button
                        onClick={handleSave}
                        className={`w-full bg-gradient-to-r ${
                          COLORS.successBg
                        } ${
                          COLORS.successText
                        } font-semibold py-2 px-6 rounded-lg hover:bg-green-200 transition-all duration-200 ${
                          isUploading ? "opacity-50 cursor-not-allowed" : ""
                        }`} // Using success colors as closest match
                        whileHover={{ scale: isUploading ? 1 : 1.05 }}
                        whileTap={{ scale: isUploading ? 1 : 0.95 }}
                        aria-label={
                          isUploading ? "Saving avatar" : "Save avatar"
                        }
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                            Saving...
                          </div>
                        ) : (
                          "Save Avatar"
                        )}
                      </motion.button>
                      {isUploading && (
                        <div className="mt-4 w-full">
                          <div
                            className={`${COLORS.bgGray} rounded-lg h-2 overflow-hidden`}
                          >
                            <motion.div
                              className={`bg-indigo-600 h-full`} // No matching color in COLORS, using fallback
                              initial={{ width: "0%" }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.2 }}
                              role="progressbar"
                              aria-valuenow={progress}
                              aria-valuemin="0"
                              aria-valuemax="100"
                              aria-label="Upload progress"
                            />
                          </div>
                          <p
                            className={`text-sm ${COLORS.textMuted} mt-2 text-center`}
                          >
                            Uploading... {progress}%
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {" "}
          {showLogoutModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            >
              {" "}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm text-center"
              >
                {" "}
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {" "}
                  Are you sure you want to logout?{" "}
                </h3>{" "}
                <div className="flex justify-center gap-4">
                  {" "}
                  <button
                    onClick={() => {
                      setShowLogoutModal(false);
                      handleLogout();
                    }}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    {" "}
                    Logout{" "}
                  </button>{" "}
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    {" "}
                    Cancel{" "}
                  </button>{" "}
                </div>{" "}
              </motion.div>{" "}
            </motion.div>
          )}{" "}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;
