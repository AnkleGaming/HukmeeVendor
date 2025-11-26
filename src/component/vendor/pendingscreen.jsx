import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GetOrders from "../../backend/order/getorders";
import COLORS from "../core/constant";
import UpdateOrderstatus from "../../backend/order/updateorderstatus";
import StartServiceVerify from "../ui/startserviceverify";

const PendingScreen = () => {
  const [getorder, setGetOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showotp, setShowotp] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otp, setOtp] = useState(null);

  const otpModalRef = useRef(null);
  const UserID = localStorage.getItem("userPhone");
  const isMobile = window.innerWidth < 768;

  // Prevent scroll when OTP modal is open
  useEffect(() => {
    const active = showotp;
    document.body.classList.toggle("overflow-hidden", active);
    return () => document.body.classList.remove("overflow-hidden");
  }, [showotp]);

  // Fetch orders
  useEffect(() => {
    const fetchgetorder = async () => {
      setIsLoading(true);
      try {
        const data = await GetOrders(UserID, "Done");
        console.log("Fetched Orders:", data);
        setGetOrder(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setGetOrder([]);
      }
      setIsLoading(false);
    };

    if (UserID) fetchgetorder();
  }, [UserID]);

  // Cancel Order
  const handleCancelService = async (orderId) => {
    try {
      const response = await UpdateOrderstatus({
        OrderID: orderId,
        Status: "Cancelled",
        VendorPhone: UserID,
        BeforVideo: "",
        AfterVideo: "",
        OTP: "",
        PaymentMethod: "",
      });

      console.log("Cancel Response:", response);
      alert(response?.message || "Order cancelled successfully!");

      const refreshedData = await GetOrders(UserID, "Done");
      setGetOrder(refreshedData || []);
    } catch (error) {
      console.error("Cancel Order Error:", error);
      alert("Failed to cancel the order.");
    }
  };

  // Accept/Start Order
  const handleAcceptService = async (order) => {
    console.log("Starting service for order:", order);

    // safely extract the value
    const otpValue = order?.OTP || order?.otp || (order?._doc?.OTP ?? null);
    console.log("Extracted OTP:", otpValue);

    setOtp(otpValue);
    setSelectedOrder(order);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowotp(true);
    }, 500);
  };

  const handleOtpSuccess = async () => {
    if (!selectedOrder) {
      alert("No order selected!");
      return;
    }

    try {
      const response = await UpdateOrderstatus({
        OrderID: selectedOrder.OrderID,
        Status: "Onservice",
        VendorPhone: UserID,
        BeforVideo: "",
        AfterVideo: "",
        OTP: "",
        PaymentMethod: "",
      });

      console.log("Update response:", response);
      alert(`Order ${selectedOrder.OrderID} status updated to Onservice`);
    } catch (error) {
      console.error("Error in OTP success handling:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setShowotp(false);
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

  return (
    <div className={`${COLORS.bgGray} py-10`}>
      {isLoading ? (
        <div className={`text-center ${COLORS.gradientFrom} font-semibold`}>
          Loading orders...
        </div>
      ) : (
        <OrderDetails
          orders={getorder}
          onCancel={handleCancelService}
          onAccept={handleAcceptService}
        />
      )}

      {/* ✅ OTP Modal Here */}
      <AnimatePresence>
        {showotp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center"
          >
            {isMobile ? (
              <motion.div
                variants={bottomSheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="fixed bottom-0 left-0 right-0 w-full h-[70vh] bg-white rounded-t-2xl shadow-2xl p-6 max-w-md mx-auto"
                ref={otpModalRef}
              >
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <StartServiceVerify
                  onVerify={handleOtpSuccess}
                  onClose={() => setShowotp(false)}
                  otpp={otp}
                />
              </motion.div>
            ) : (
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
                ref={otpModalRef}
              >
                <StartServiceVerify
                  onVerify={handleOtpSuccess}
                  onClose={() => setShowotp(false)}
                  otpp={otp}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingScreen;

// ==========================
// ✅ OrderDetails Component
// ==========================
const OrderDetails = ({ orders, onCancel, onAccept }) => {
  const headers = [
    "OrderID",
    "UserID",
    "OrderType",
    "ItemName",
    "Price",
    "Quantity",
    "Status",
  ];

  return (
    <div
      className={`max-w-full mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border ${COLORS.borderGray}`}
    >
      <h2
        className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${COLORS.gradientFrom} ${COLORS.gradientTo} bg-clip-text text-transparent p-6`}
      >
        Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={COLORS.tableHeadBg}>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${COLORS.tableHeadText}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className={`px-6 py-4 text-center ${COLORS.textGray}`}
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.ID} className="hover:bg-gray-50 transition">
                  <td className={`px-6 py-4 text-sm ${COLORS.textGrayDark}`}>
                    {order.OrderID}
                  </td>
                  <td className={`px-6 py-4 text-sm ${COLORS.textGrayDark}`}>
                    {order.UserID}
                  </td>
                  <td className={`px-6 py-4 text-sm ${COLORS.textGrayDark}`}>
                    {order.OrderType}
                  </td>
                  <td className={`px-6 py-4 text-sm ${COLORS.textGrayDark}`}>
                    {order.ItemName}
                  </td>
                  <td className={`px-6 py-4 text-sm ${COLORS.textGrayDark}`}>
                    ₹{order.Price}
                  </td>
                  <td className={`px-6 py-4 text-sm ${COLORS.textGrayDark}`}>
                    {order.Quantity}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.Status === "Pending"
                            ? `${COLORS.pendingBg} ${COLORS.pendingText}`
                            : `${COLORS.successBg} ${COLORS.successText}`
                        }`}
                      >
                        {order.Status}
                      </span>

                      {order.Status === "Done" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onAccept(order)}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition"
                          >
                            Start Service
                          </button>
                          <button
                            onClick={() => onCancel(order.OrderID)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition"
                          >
                            Cancel Service
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
