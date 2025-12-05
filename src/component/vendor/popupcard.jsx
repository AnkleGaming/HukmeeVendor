import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import colors from "../core/constant";
import DeclineLeads from "../../backend/order/declineleads";
import ShowLeads from "../../backend/order/showleads";
import UpdateOrders from "../../backend/order/updateorderstatus";
import AcceptLeads from "../../backend/order/acceptleads";
import GetOrders from "../../backend/order/getorders";

const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
};

const Popupcard = ({ onClose }) => {
  const { width } = useWindowSize();
  const isMobile = width < 640;

  const [timer, setTimer] = useState(60);
  const [pendingLead, setPendingLead] = useState(null); // ← Always object or null
  const [orderDetails, setOrderDetails] = useState([]); // ← Full order items
  const [loading, setLoading] = useState(false);

  const UserID = localStorage.getItem("userPhone");
  const intervalRef = useRef(null);

  // Step 1: Fetch pending lead
  useEffect(() => {
    if (!UserID) return;

    const fetchLead = async () => {
      try {
        const leads = await ShowLeads(UserID, "Pending");
        if (leads && leads.length > 0) {
          setPendingLead(leads[0]); // Take first pending lead
          setTimer(60); // Reset timer
        } else {
          setPendingLead(null);
          onClose?.(); // No lead → close popup
        }
      } catch (err) {
        console.error("Failed to fetch leads:", err);
        onClose?.();
      }
    };

    fetchLead();
  }, [UserID, onClose]);

  // Timer + Auto Decline
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!pendingLead) return;

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          autoDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [pendingLead]);

  const autoDecline = async () => {
    if (!pendingLead?.OrderID) return;

    setLoading(true);
    try {
      const res = await DeclineLeads(pendingLead.OrderID, UserID);
      if (res?.message === "Lead Declined Successfully") {
        window.location.reload();
      } else {
        onClose?.();
      }
    } catch (err) {
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!pendingLead) return;
    clearInterval(intervalRef.current);
    setTimer(0);
    setLoading(true);

    try {
      await UpdateOrders({
        OrderID: pendingLead.OrderID,
        Status: "Done",
        VendorPhone: UserID,
        // other fields empty as needed
      });

      await AcceptLeads(pendingLead.OrderID, UserID);
      window.location.reload();
    } catch (err) {
      alert("Accept failed");
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!pendingLead) return;
    clearInterval(intervalRef.current);
    setTimer(0);
    setLoading(true);

    try {
      const res = await DeclineLeads(pendingLead.OrderID, UserID);
      if (res?.message === "Lead Declined Successfully") {
        alert("Declined");
        window.location.reload();
      }
    } catch (err) {
      alert("Decline failed");
    } finally {
      setLoading(false);
      onClose?.();
    }
  };

  // Don't render if no lead
  if (!pendingLead) return null;

  const item = orderDetails[0] || {};

  const Content = (
    <>
      <div className="mb-6">
        <h2
          className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${colors.primaryFrom} ${colors.primaryTo} bg-clip-text text-transparent`}
        >
          New Order Alert
        </h2>
        <p className="text-sm text-gray-600 mt-2 flex justify-between">
          <span>Auto decline in</span>
          <span
            className={`font-bold ${
              timer <= 10 ? "text-red-600 animate-pulse" : "text-red-500"
            }`}
          >
            {timer}s
          </span>
        </p>
      </div>

      {/* Real Order Details */}
      <div className="mb-6 bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
        <h3 className="font-semibold text-gray-800">Order Details</h3>
        <div className="space-y-2">
          <p>
            <strong>Customer:</strong> {pendingLead.CustomerName || "N/A"}
          </p>
          <p>
            <strong>Service:</strong> {item.ServiceName || "Loading..."}
          </p>
          <p>
            <strong>Price:</strong> ₹{item.Price || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {item.Address || "Not provided"}
          </p>
          {item.Slot && (
            <p>
              <strong>Slot:</strong> {item.Slot}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleAccept}
          disabled={loading}
          className={`flex-1 py-3 rounded-lg font-bold text-white bg-gradient-to-r ${
            colors.primaryFrom
          } ${colors.primaryTo} transition-all ${
            loading ? "opacity-70" : "hover:shadow-lg"
          }`}
        >
          {loading ? "Accepting..." : "Accept Order"}
        </button>
        <button
          onClick={handleDecline}
          disabled={loading}
          className={`flex-1 py-3 rounded-lg font-bold border ${colors.borderGray} text-gray-700 hover:bg-gray-100 transition-all`}
        >
          Decline
        </button>
      </div>
    </>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={(e) => e.target === e.currentTarget && !loading && onClose?.()}
      >
        <motion.div
          variants={
            isMobile
              ? { hidden: { y: "100%" }, visible: { y: 0 } }
              : {
                  hidden: { scale: 0.95, opacity: 0 },
                  visible: { scale: 1, opacity: 1 },
                }
          }
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
          className={
            isMobile
              ? "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 max-w-md mx-auto"
              : "bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          }
        >
          {isMobile && (
            <div className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mb-5"></div>
          )}
          {Content}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Popupcard;
