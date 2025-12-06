import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RegisterUser from "../../backend/authentication/register";
import GetUser from "../../backend/authentication/getuser";
import colors from "../core/constant";

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

const OtpVerification = ({ onClose, onVerify }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(30);
  const inputsRef = useRef([]);
  const modalRef = useRef(null);
  const phone = localStorage.getItem("userPhone");
  const { width } = useWindowSize();
  const isMobile = width < 640;
  const navigate = useNavigate();
  const otpv = localStorage.getItem("userOTP");

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  // Focus trap
  useEffect(() => {
    if (!modalRef.current) return;
    const modalElement = modalRef.current;
    const focusable = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    modalElement.addEventListener("keydown", handleKeyDown);
    first?.focus();
    return () => modalElement.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChangeNumber = () => {
    // Clear phone & OTP
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userOTP");

    // Close OTP modal
    onClose && onClose();

    // Tell parent (Navigation) to show LoginCard again
    if (typeof window !== "undefined") {
      // Trigger a custom event OR use a better state management
      window.dispatchEvent(new Event("open-login-modal"));
    }
  };

  // Handle input change
  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, "");
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      let newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  // Resend OTP
  const handleResend = () => {
    setOtp(new Array(6).fill(""));
    setTimeLeft(30);
    inputsRef.current[0]?.focus();
    alert("OTP resent to +91" + phone);
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleSubmit = async () => {
    if (!isOtpComplete) return;
    const code = otp.join("");

    // OTP validation
    if (code !== otpv) {
      alert("Invalid OTP");
      return;
    }

    onVerify && onVerify(code);

    try {
      // Fetch user data
      const userData = await GetUser(phone);

      // Save login info
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userPhone", phone);

      // Check if fullname exists
      if (userData.length > 0 && userData[0].fullname) {
        alert("✅ Welcome back, " + userData[0].fullname + "!");
        navigate("/");
        window.location.reload();
      } else {
        alert("Please complete your registration");
        navigate("/register");
      }

      onClose && onClose();
    } catch (error) {
      console.error("Error during verification:", error);
      alert("Something went wrong during verification.");
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

  if (!phone) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div className="bg-white rounded-xl p-6 shadow-lg text-center w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-2">You are not logged in</h2>
          <p className="text-sm text-gray-600 mb-4">
            Please enter your phone number first to continue.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isMobile ? (
        // Mobile bottom sheet
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          ref={modalRef}
        >
          <motion.div
            variants={bottomSheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 w-full h-[80vh] bg-white rounded-t-2xl shadow-2xl p-6 max-w-md mx-auto"
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex justify-center mb-4">
              <span className="bg-indigo-100 p-3 rounded-full">📲</span>
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">
              Enter verification code
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              A 6-digit code has been sent to <strong>+91{phone}</strong>
            </p>

            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-14 text-center border border-gray-300 rounded-lg text-lg bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>

            <div className="flex justify-between items-center w-full text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {timeLeft > 0
                  ? `00:${timeLeft.toString().padStart(2, "0")}`
                  : "Time expired"}
                {timeLeft <= 0 && (
                  <button
                    onClick={handleResend}
                    className="ml-3 text-indigo-600 font-medium underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={handleChangeNumber}
                className="text-indigo-600 font-medium underline hover:no-underline"
              >
                Change number
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isOtpComplete}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                isOtpComplete
                  ? `bg-gradient-to-r ${colors.primaryFrom} ${colors.primaryTo} ${colors.textWhite} ${colors.hoverFrom} ${colors.hoverTo} hover:cursor-pointer`
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Verify
            </button>
          </motion.div>
        </motion.div>
      ) : (
        // Desktop modal
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          ref={modalRef}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative"
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex justify-center mb-4">
              <span className="bg-indigo-100 p-3 rounded-full">📲</span>
            </div>
            <h2 className="text-2xl font-semibold text-center mb-2">
              Enter verification code
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              A 6-digit code has been sent to <strong>+91{phone}</strong>
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-10 h-12 text-center border border-gray-300 rounded-lg text-lg bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {timeLeft > 0
                  ? `00:${timeLeft.toString().padStart(2, "0")}`
                  : "Time expired"}
                {timeLeft <= 0 && (
                  <button
                    onClick={handleResend}
                    className="ml-3 text-indigo-600 font-medium underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={handleChangeNumber}
                className="text-indigo-600 font-medium underline hover:no-underline"
              >
                Change number
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isOtpComplete}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                isOtpComplete
                  ? `bg-gradient-to-r ${colors.primaryFrom} ${colors.primaryTo} ${colors.textWhite} ${colors.hoverFrom} ${colors.hoverTo} hover:cursor-pointer`
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Verify
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OtpVerification;
