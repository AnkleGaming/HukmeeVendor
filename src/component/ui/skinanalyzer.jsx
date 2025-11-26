import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import GetServicePack from "../../backend/servicepack/getservicepack";
import SuggestAnalyze from "./suggestanalyze";

const SkinAnalyzer = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("getStarted"); // 'getStarted' | 'camera' | 'results'
  const [analysisData, setAnalysisData] = useState([]); // Store API results
  const [loading, setLoading] = useState(false); // For analysis loading state
  const [error, setError] = useState(null); // For error messages
  const [progress, setProgress] = useState(0); // Progress for circular ring
  const webcamRef = useRef(null); // Ref for webcam component
  const timerRef = useRef(null); // Ref for progress and capture timer
  const [flash, setFlash] = useState(false); // For capture flash effect
  const [cameraReady, setCameraReady] = useState(false); // Track camera readiness

  // Animation variants for smooth transitions
  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  // Function to handle API call using GetServicePack
  const analyzeFace = async (imageSrc) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Capturing image:", imageSrc ? "Image captured" : "No image");
      const data = await GetServicePack(1); // Using ID 1 for dummy data
      console.log("API Response:", data);
      setAnalysisData(data);
      setStep("results");
    } catch (error) {
      console.error("API Error:", error);
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Synchronized progress and image capture
  useEffect(() => {
    if (step === "camera" && cameraReady) {
      console.log("Camera step activated and camera is ready");
      const duration = 4500; // 4.5 seconds
      const interval = 25; // Update every 25ms for smoother animation
      const steps = duration / interval;
      let currentStep = 0;

      // Single timer for progress and capture
      timerRef.current = setInterval(() => {
        currentStep++;
        const newProgress = Math.min((currentStep / steps) * 100, 100); // Cap at 100
        setProgress(newProgress);

        if (newProgress >= 100) {
          clearInterval(timerRef.current);
          if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            console.log("Image captured:", imageSrc ? "Success" : "Failed");
            if (imageSrc) {
              setFlash(true); // Trigger flash effect
              setTimeout(() => setFlash(false), 200); // Reset flash after 200ms
              analyzeFace(imageSrc);
            } else {
              setError(
                "Failed to capture image. Ensure camera access is allowed."
              );
              setStep("getStarted");
            }
          } else {
            setError("Camera not initialized. Please try again.");
            setStep("getStarted");
          }
        }
      }, interval);

      return () => {
        clearInterval(timerRef.current);
        setProgress(0); // Reset progress on exit
      };
    }
  }, [step, cameraReady]);

  // Reset progress and cameraReady when exiting camera step
  useEffect(() => {
    if (step !== "camera") {
      setProgress(0);
      setCameraReady(false);
    }
  }, [step]);

  // Get Started Page
  if (step === "getStarted") {
    return (
      <AnimatePresence>
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:px-6 pt-16"
        >
          {/* Header with Back Button and Title */}
          <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10 border-b border-gray-200">
            <div className="flex items-center justify-start px-4 py-3 sm:px-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-600 hover:text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>
              <h2 className="text-xl sm:text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Skin Analyzer
              </h2>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="flex items-center justify-center flex-grow">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-6 sm:p-8 text-center border border-gray-100">
              <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                Discover personalized skincare with our AI-powered analyzer.
                Scan your face in seconds for tailored recommendations.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep("camera")}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-lg"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Camera Preview and Auto-Analysis
  if (step === "camera") {
    return (
      <AnimatePresence>
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4 sm:p-6"
        >
          <div className="max-w-lg w-full bg-white shadow-2xl rounded-2xl p-6 sm:p-8 text-center border border-gray-100 relative">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
              Analyzing Your Skin...
            </h2>
            <div className="relative w-full max-w-[300px] aspect-square mx-auto">
              {/* Circular progress ring */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="4"
                  strokeDasharray="301.6"
                  strokeDashoffset={301.6 - (progress / 100) * 301.6}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 0.025s linear" }}
                />
              </svg>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className={`w-full h-full rounded-full transition-opacity duration-200 ${
                  flash ? "opacity-50" : "opacity-100"
                }`}
                videoConstraints={{ facingMode: "user" }}
                onUserMedia={() => {
                  console.log("Camera stream started");
                  setCameraReady(true); // Start progress ring when camera is ready
                }}
                onUserMediaError={() => {
                  setError("Camera access denied. Please allow camera access.");
                  setStep("getStarted");
                }}
              />
              {/* Flash effect */}
              {flash && (
                <div className="absolute inset-0 bg-white/70 rounded-full animate-pulse" />
              )}
            </div>
            {cameraReady ? (
              <p className="text-gray-600 mt-4 mb-4 text-sm sm:text-base">
                Scanning in progress...
              </p>
            ) : (
              <p className="text-gray-600 mt-4 mb-4 text-sm sm:text-base">
                Starting camera...
              </p>
            )}
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep("getStarted")}
              className="text-indigo-600 hover:underline font-medium text-sm sm:text-base"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Results Display
  if (step === "results") {
    return (
      <AnimatePresence>
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 bg-white/95 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6"
        >
          <div>
            <SuggestAnalyze />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
};

export default SkinAnalyzer;
