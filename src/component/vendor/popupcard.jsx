import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import colors from "../core/constant";
import DeclineLeads from "../../backend/order/declineleads";
import UpdateOrders from "../../backend/order/updateorderstatus";
import AcceptLeads from "../../backend/order/acceptleads";
import GetAlertOrder from "../../backend/order/showalertorder";

const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
};

const Popupcard = ({ data, onClose }) => {
  const { width } = useWindowSize();
  const isMobile = width < 640;

  const [timer, setTimer] = useState(60);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const UserID = localStorage.getItem("userPhone");
  const intervalRef = useRef(null);

  const pendingLead = data; // We now receive data from parent

  // Fetch full order details
  useEffect(() => {
    if (!pendingLead?.OrderID) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const details = await GetAlertOrder(pendingLead.OrderID);
        setOrderDetails(details || []);
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [pendingLead?.OrderID]);

  // Timer + Auto Decline
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

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
  }, []);

  const closePopup = () => {
    clearInterval(intervalRef.current);
    onClose(); // This tells parent to hide popup
  };

  const autoDecline = async () => {
    if (!pendingLead?.OrderID) return;
    setLoading(true);
    try {
      await DeclineLeads(pendingLead.OrderID, UserID);
    } catch (err) {
      console.error("Auto decline failed:", err);
    } finally {
      closePopup();
    }
  };

  const handleAccept = async () => {
    if (!pendingLead) return;
    clearInterval(intervalRef.current);
    setLoading(true);

    try {
      await UpdateOrders({
        OrderID: pendingLead.OrderID,
        Status: "Done",
        VendorPhone: UserID,
      });
      await AcceptLeads(pendingLead.OrderID, UserID);
    } catch (err) {
      alert("Accept failed");
    } finally {
      closePopup(); // Only this — no reload!
    }
  };

  const handleDecline = async () => {
    if (!pendingLead) return;
    clearInterval(intervalRef.current);
    setLoading(true);

    try {
      await DeclineLeads(pendingLead.OrderID, UserID);
    } catch (err) {
      alert("Decline failed");
    } finally {
      closePopup(); // Only this — no reload!
    }
  };

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

      <div className="mb-6 bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
        <h3 className="font-semibold text-gray-800">Order Details</h3>
        <div className="space-y-2">
          <p>
            <strong>Service:</strong> {item.ItemName || "Loading..."}
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
          {item.Quantity && item.Quantity !== "1" && (
            <p>
              <strong>Quantity:</strong> {item.Quantity}
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
          {loading ? "Declining..." : "Decline"}
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 mb-15"
        onClick={(e) =>
          e.target === e.currentTarget && !loading && closePopup()
        }
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
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={
            isMobile
              ? "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 max-w-md mx-auto"
              : "bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          }
        >
          {isMobile && (
            <div className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mb-5" />
          )}
          {Content}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Popupcard;
