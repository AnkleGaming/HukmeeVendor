import { useState, useEffect, useRef } from "react";
import { Phone, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import colors from "../core/constant"; // ✅ corrected import
import SendSMS from "../../backend/authentication/getotp";

// ✅ Hook to get window width (for mobile/desktop detection)
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: undefined });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Run once
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const LoginCard = ({ onClose, onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const isValid = phoneNumber.length === 10;
  const { width } = useWindowSize();
  const isMobile = width < 640;
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const modalElement = modalRef.current;
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
  }, []);

  const handleContinue = async () => {
    if (!isValid || loading) return;
    setLoading(true);

    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem("userPhone", phoneNumber);
      localStorage.setItem("userOTP", otp);

      const smsResult = await SendSMS(phoneNumber, otp);
      if (smsResult.success) {
        alert(`✅ OTP sent successfully to +91${phoneNumber}`);
        onSubmit(phoneNumber); // proceed to OTP verification
      } else {
        alert(`❌ Failed to send OTP. Try again later.`);
        console.error("SendSMS error:", smsResult);
      }
      onSubmit(phoneNumber);
    } catch (error) {
      console.error("Error saving phone number:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Animations
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
    <AnimatePresence>
      {isMobile ? (
        // ✅ Mobile Bottom Sheet
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          role="dialog"
          aria-modal="true"
          ref={modalRef}
        >
          <motion.div
            variants={bottomSheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-0 left-0 right-0 w-full h-[80vh] bg-white rounded-t-2xl shadow-2xl p-6 sm:p-8 font-sans max-w-md mx-auto"
          >
            {/* Handle bar */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="mb-6">
              {/* Brand Orange Icon */}
              <Phone className={`w-8 h-8 mb-3 ${colors.tableHeadText}`} />
              <h2
                className={`text-2xl font-bold bg-gradient-to-r ${colors.primaryFrom} ${colors.primaryTo} bg-clip-text text-transparent`}
              >
                Enter your phone number
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                We’ll send you a verification code via SMS.
              </p>
            </div>

            {/* Input */}
            <div className="flex gap-3 mb-6">
              <select
                className={`border ${colors.borderGray} rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-800 focus:ring-2 focus:ring-[#FA7D09]`}
              >
                <option value="+91">+91</option>
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setPhoneNumber(onlyNums.slice(0, 10));
                }}
                placeholder="Enter your phone number"
                className={`flex-1 border ${colors.borderGray} rounded-lg px-4 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-[#FA7D09]`}
              />
            </div>

            {/* Button */}
            <button
              onClick={handleContinue}
              disabled={!isValid || loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                isValid && !loading
                  ? `bg-gradient-to-r ${colors.primaryFrom} ${colors.primaryTo} ${colors.textWhite} ${colors.hoverFrom} ${colors.hoverTo}`
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Processing..." : "Continue"}
            </button>

            {/* T&C */}
            <p className="mt-5 text-xs text-center text-gray-600">
              By continuing, you agree to our{" "}
              <button
                onClick={() => navigate("/terms")}
                className="underline text-indigo-600 hover:text-indigo-800"
              >
                Terms
              </button>{" "}
              and{" "}
              <button
                onClick={() => navigate("/privacy")}
                className="underline text-indigo-600 hover:text-indigo-800"
              >
                Privacy Policy
              </button>
              .
            </p>
          </motion.div>
        </motion.div>
      ) : (
        // ✅ Desktop Modal
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          ref={modalRef}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100 font-sans"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="mb-6">
              <Phone className={`w-8 h-8 mb-3 ${colors.tableHeadText}`} />
              <h2
                className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${colors.primaryFrom} ${colors.primaryTo} bg-clip-text text-transparent`}
              >
                Enter your phone number
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                We’ll send you a verification code via SMS.
              </p>
            </div>

            {/* Input */}
            <div className="flex mb-6">
              <select
                className={`border ${colors.borderGray} rounded-l-lg px-3 py-2 text-sm bg-gray-50 text-gray-800 focus:ring-2 focus:ring-[#FA7D09]`}
              >
                <option value="+91">+91</option>
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setPhoneNumber(onlyNums.slice(0, 10));
                }}
                placeholder="Enter your phone number"
                className={`flex-1 border ${colors.borderGray} rounded-r-lg px-4 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-[#FA7D09]`}
              />
            </div>

            {/* Button */}
            <button
              onClick={handleContinue}
              disabled={!isValid || loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                isValid && !loading
                  ? `bg-gradient-to-r ${colors.primaryFrom} ${colors.primaryTo} ${colors.textWhite} ${colors.hoverFrom} ${colors.hoverTo} hover:cursor-pointer`
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Processing..." : "Continue"}
            </button>

            {/* T&C */}
            <p className="mt-5 text-xs text-center text-gray-600">
              By continuing, you agree to our{" "}
              <button
                onClick={() => navigate("/terms")}
                className="underline text-indigo-600 hover:text-indigo-800"
              >
                Terms
              </button>{" "}
              and{" "}
              <button
                onClick={() => navigate("/privacy")}
                className="underline text-indigo-600 hover:text-indigo-800"
              >
                Privacy Policy
              </button>
              .
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginCard;
