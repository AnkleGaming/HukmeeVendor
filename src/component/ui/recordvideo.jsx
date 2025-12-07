import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  StopCircle,
  Upload,
  RotateCcw,
  Camera,
  CameraOff,
  FlipHorizontal2,
  Zap,
  ZapOff,
  X,
  Loader2,
} from "lucide-react";
import UpdateOrders from "../../backend/order/updateorderstatus";

const RecordVideo = ({
  onClose,
  onUploaded,
  OrderID,
  VendorPhone,
  Status = "",
  type = "Before",
  OTP = "",
  PaymentMethod = "",
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [facingMode, setFacingMode] = useState("user"); // 'user' or 'environment'
  const [flashOn, setFlashOn] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const trackRef = useRef(null);

  // Initialize camera
  useEffect(() => {
    // Only start camera when there is NO recorded video
    if (videoURL) return;

    const initCamera = async () => {
      // Stop old stream if exists
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true,
        });
        streamRef.current = stream;
        trackRef.current = stream.getVideoTracks()[0];

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }

        // Flash
        if (trackRef.current?.applyConstraints) {
          try {
            await trackRef.current.applyConstraints({
              advanced: [{ torch: flashOn }],
            });
          } catch (e) {}
        }
      } catch (err) {
        alert("Camera access denied!");
        console.error(err);
      }
    };

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      clearInterval(timerRef.current);
    };
  }, [facingMode, flashOn, videoURL]); // ← This line is the key!

  // Start Recording
  const handleStartRecording = () => {
    if (!streamRef.current) return;

    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm;codecs=vp9",
    });

    const localChunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) localChunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(localChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
      setChunks(localChunks);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
    setRecordingTime(0);

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  // Stop Recording
  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  // Reset
  // REPLACE your old handleReset with this
  const handleRetake = () => {
    // Clean old video from memory
    if (videoURL) {
      URL.revokeObjectURL(videoURL);
    }

    // Reset all states
    setVideoURL(null);
    setChunks([]);
    setRecordingTime(0);
    setUploadProgress(0);
    setIsRecording(false);

    // Optional: Force video element to show live stream again
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  };
  // Flip Camera
  const flipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    handleReset();
  };

  // Toggle Flash

  // Convert Blob to Base64 with progress simulation
  const blobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      let progress = 0;
      const interval = setInterval(() => {
        progress += 15;
        setUploadProgress(Math.min(progress, 90));
        if (progress >= 90) clearInterval(interval);
      }, 200);

      reader.onloadend = () => {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => resolve(reader.result.split(",")[1]), 300);
      };
      reader.readAsDataURL(blob);
    });
  };

  // Upload Video
  const handleUpload = async () => {
    if (!chunks.length) {
      alert("No video to upload!");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Convert recorded chunks to blob
      const blob = new Blob(chunks, { type: "video/webm" });

      // Convert blob → base64 (simple)
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1]; // get only base64 part
        setUploadProgress(100);

        // Make request
        const payload = {
          OrderID,
          Price: "",
          Quantity: "",
          Address: "",
          Slot: "",
          Status,
          VendorPhone,
          BeforVideo: type === "Before" ? base64String : "",
          AfterVideo: type === "After" ? base64String : "",
          OTP,
          PaymentMethod,
        };

        const response = await UpdateOrders(payload);
        console.log("Upload Response:", response);

        // If AFTER video, mark service completed
        if (type === "After") {
          await UpdateOrders({ OrderID, Status: "Completed", VendorPhone });
          alert("Service completed!");
          window.location.reload();
          return;
        }

        alert(`${type} video uploaded successfully!`);
        onUploaded?.(OrderID);
        onClose?.();

        setIsUploading(false);
        setUploadProgress(0);
      };
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/10 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glass Header */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl -z-10" />

          <button
            onClick={onClose}
            disabled={isUploading || isRecording}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition z-10"
          >
            <X size={22} />
          </button>

          <div className="text-center mb-5">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Camera size={28} />
              Record {type} Video
            </h2>
            <p className="text-sm text-white/60 mt-1">Order #{OrderID}</p>
          </div>

          {/* Video Preview */}

          <div className="relative rounded-2xl overflow-hidden bg-black/50 backdrop-blur-sm shadow-inner">
            {!videoURL && (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 object-cover"
              />
            )}

            {isRecording && (
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2.5 h-2.5 bg-white rounded-full"
                />
                REC {formatTime(recordingTime)}
              </div>
            )}

            {/* Flash Overlay */}
            {flashOn && !videoURL && (
              <div className="absolute inset-0 bg-white/20 pointer-events-none" />
            )}
          </div>

          {/* Controls */}
          <div className="mt-5 space-y-4">
            {/* Camera Controls */}
            {!videoURL && (
              <div className="flex justify-center gap-3">
                <button
                  onClick={flipCamera}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition"
                  title="Flip Camera"
                >
                  <FlipHorizontal2 size={20} />
                </button>
                {/* <button
                  onClick={toggleFlash}
                  className={`p-3 rounded-full backdrop-blur-sm transition ${
                    flashOn
                      ? "bg-yellow-500/80 text-yellow-900"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  title="Toggle Flash"
                >
                  {flashOn ? <Zap size={20} /> : <ZapOff size={20} />}
                </button> */}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              {!isRecording && !videoURL && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartRecording}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition"
                >
                  <Video size={20} />
                  Start Recording
                </motion.button>
              )}

              {isRecording && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStopRecording}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition"
                >
                  <StopCircle size={20} />
                  Stop
                </motion.button>
              )}

              {!isRecording && videoURL && (
                <>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetake} // ← Just change this line
                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-full font-medium flex items-center gap-2 backdrop-blur-sm transition"
                  >
                    <RotateCcw size={18} />
                    Retake
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg transition ${
                      isUploading
                        ? "bg-gray-600 text-white/70 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl"
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        Upload
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="mt-3">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-600"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecordVideo;
