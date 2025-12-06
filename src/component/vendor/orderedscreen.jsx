import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import GetOrders from "../../backend/order/getorders";
import COLORS from "../core/constant";
import UpdateOrderstatus from "../../backend/order/updateorderstatus";
import StartServiceVerify from "../ui/startserviceverify";

const AcceptedScreen = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otp, setOtp] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  const UserID = localStorage.getItem("userPhone");
  const isMobile = window.innerWidth < 768;

  // Prevent scroll when modal open
  useEffect(() => {
    document.body.style.overflow =
      showOtpModal || showCancelModal ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showOtpModal, showCancelModal]);

  // Fetch orders
  // Inside your AcceptedScreen component, replace the useEffect that sets orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!UserID) return;
      setIsLoading(true);

      try {
        const data = await GetOrders("", UserID, "Done");

        // Step 1: Group by OrderID
        const groupedOrders = {};

        (data || []).forEach((item) => {
          const orderId = item.OrderID;

          if (!groupedOrders[orderId]) {
            groupedOrders[orderId] = {
              OrderID: orderId,
              UserID: item.UserID,
              Address: item.Address,
              SlotDatetime: item.SlotDatetime,
              Slot: item.Slot,
              OrderDatetime: item.OrderDatetime,
              Status: item.Status,
              OTP: item.OTP || item.otp || item._doc?.OTP,
              items: [], // This will hold all items
              totalPrice: 0,
              totalQuantity: 0,
            };
          }

          // Add item details
          groupedOrders[orderId].items.push({
            ItemName: item.ItemName,
            OrderType: item.OrderType,
            Price: parseFloat(item.Price) || 0,
            Quantity: parseInt(item.Quantity) || 0,
            OrderDatetime: item.OrderDatetime,
          });

          // Accumulate totals
          groupedOrders[orderId].totalPrice += parseFloat(item.Price) || 0;
          groupedOrders[orderId].totalQuantity += parseInt(item.Quantity) || 0;
        });

        // Convert to array and reverse (newest first)
        const groupedArray = Object.values(groupedOrders).reverse();

        setOrders(groupedArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [UserID]);

  // Cancel Order
  const handleCancelService = async (orderId) => {
    try {
      const response = await UpdateOrderstatus({
        OrderID: orderId,
        Price: "",
        Quantity: "",
        Status: "Cancelled",
        VendorPhone: UserID,
        BeforVideo: "",
        AfterVideo: "",
        OTP: "",
        PaymentMethod: "",
      });

      alert(response?.message || "Order cancelled successfully!");
      const refreshed = await GetOrders(UserID, "Done");
      setOrders(refreshed || []);
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel order.");
    } finally {
      setShowCancelModal(false);
    }
  };

  // Start Service
  const handleStartService = (order) => {
    setOtp(order.OTP);
    setSelectedOrder(order); // This now has .items, .totalPrice etc.
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpModal(true);
    }, 400);
  };

  const handleOtpSuccess = async () => {
    if (!selectedOrder) return;

    try {
      await UpdateOrderstatus({
        OrderID: selectedOrder.OrderID,
        Price: "",
        Quantity: "",
        Status: "Onservice",
        VendorPhone: UserID,
        BeforVideo: "",
        AfterVideo: "",
        OTP: "",
        PaymentMethod: "",
      });
      window.location.reload();
    } catch (error) {
      console.error("OTP success error:", error);
      alert("Failed to start service.");
    } finally {
      setShowOtpModal(false);
    }
  };

  const openCancelModal = (order) => {
    setCancelOrderId(order.OrderID);
    setShowCancelModal(true);
  };

  return (
    <div className={`${COLORS.bgGray} min-h-screen py-6 px-4`}>
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${COLORS.gradientFrom} ${COLORS.gradientTo} bg-clip-text text-transparent mb-8 text-center`}
        >
          Accepted Orders
        </motion.h1>

        {isLoading ? (
          <LoadingSkeleton />
        ) : orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {orders.map((order, index) => (
                <OrderCard
                  key={order.OrderID}
                  order={order}
                  index={index}
                  onStart={handleStartService}
                  onCancel={openCancelModal}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpSuccess}
        otp={otp}
        isMobile={isMobile}
        isProcessing={isProcessing}
      />

      {/* Cancel Confirmation Modal */}
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => handleCancelService(cancelOrderId)}
      />
    </div>
  );
};

// ==========================
// Order Card Component
// ==========================
const OrderCard = ({ order, index, onStart, onCancel }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const formatSlotDate = () => {
    if (!order.SlotDatetime) return "Not scheduled";
    try {
      const date = new Date(order.SlotDatetime);
      return date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return order.Slot || "Scheduled";
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              #{order.OrderID}
            </h3>
            <p className="text-sm text-gray-500">User: {order.UserID}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              order.Status === "Done"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.Status === "Done" ? (
              <CheckCircle size={14} />
            ) : (
              <Clock size={14} />
            )}
            {order.Status}
          </span>
        </div>

        {/* Items List */}
        <div className="space-y-3 mb-4">
          <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
            <Package size={16} />
            Services ({order.items.length})
          </h4>

          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.ItemName}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {item.OrderType}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-green-600">₹{item.Price}</p>
                  <p className="text-xs text-gray-500">Qty: {item.Quantity}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="border-t-2 border-dashed pt-3 mt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-green-600">₹{order.totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Items</span>
              <span>{order.totalQuantity} units</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="pt-3 border-t border-gray-200 mb-4">
          <div className="flex items-start gap-2 text-sm">
            <span className="text-gray-600">Address</span>
            <p className="text-gray-800 flex-1 text-right leading-relaxed">
              {order.Address || "Not provided"}
            </p>
          </div>
        </div>

        {/* Scheduled Slot */}
        {/* Scheduled Slot */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 mb-6">
          <span className="text-gray-600 text-xs flex items-center gap-1">
            <Calendar size={14} className="text-orange-500" />
            Scheduled
          </span>
          <div className="text-right">
            {order.Slot ? (
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                {order.Slot}
              </p>
            ) : (
              <p className="text-xs text-gray-400">Not scheduled</p>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        {order.Status === "Done" && (
          <div className="flex gap-3">
            <button
              onClick={() => onStart(order)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Package size={18} />
              Start Service
            </button>
            <button
              onClick={() => onCancel(order)}
              className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              <XCircle size={18} />
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ==========================
// Loading Skeleton
// ==========================
const LoadingSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-lg p-5 animate-pulse border border-gray-100"
      >
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="flex gap-3 mt-5">
          <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
          <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
        </div>
      </div>
    ))}
  </div>
);

// ==========================
// Empty State
// ==========================
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-16"
  >
    <div className="bg-gray-100 w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center">
      <Package size={48} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      No Accepted Orders
    </h3>
    <p className="text-gray-500 max-w-md mx-auto">
      When customers accept your service, their orders will appear here ready to
      start.
    </p>
  </motion.div>
);

// ==========================
// OTP Modal (Bottom Sheet on Mobile)
// ==========================
const OTPModal = ({
  isOpen,
  onClose,
  onVerify,
  otp,
  isMobile,
  isProcessing,
}) => {
  const bottomSheet = {
    hidden: { y: "100%" },
    visible: { y: 0 },
    exit: { y: "100%" },
  };

  const modal = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            variants={isMobile ? bottomSheet : modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`${
              isMobile
                ? "fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl p-6 pb-8"
                : "bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {isMobile && (
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5" />
            )}

            {isProcessing ? (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="mt-3 text-gray-600">Preparing service...</p>
              </div>
            ) : (
              <StartServiceVerify
                onVerify={onVerify}
                onClose={onClose}
                otpp={otp}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==========================
// Cancel Confirmation Modal
// ==========================
const CancelModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Cancel This Order?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. The customer will be notified.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-700 transition"
              >
                Yes, Cancel
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-300 transition"
              >
                Keep Order
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AcceptedScreen;
