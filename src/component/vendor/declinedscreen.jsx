import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GetOrders from "../../backend/order/getorders";
import COLORS from "../core/constant";
import {
  XCircle,
  Package,
  User,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  ShoppingBag,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";

const DeclinedScreen = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const UserID = localStorage.getItem("userPhone");

  useEffect(() => {
    const fetchDeclinedOrders = async () => {
      if (!UserID) return;
      setIsLoading(true);
      try {
        const data = await GetOrders("", UserID, "Declined"); // or "Declined" if backend uses that
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching declined orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeclinedOrders();
  }, [UserID]);

  return (
    <div className={`${COLORS.bgGray} min-h-screen py-6 px-4`}>
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${COLORS.gradientFrom} ${COLORS.gradientTo} bg-clip-text text-transparent mb-8 text-center`}
        >
          Declined Orders
        </motion.h1>

        {isLoading ? (
          <LoadingSkeleton />
        ) : orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {orders.map((order, index) => (
                <DeclinedOrderCard
                  key={order.OrderID}
                  order={order}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================
// Declined Order Card
// ==========================
const DeclinedOrderCard = ({ order, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      <div className="p-5">
        {/* Header: Order ID + Status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <Package size={18} />#{order.OrderID}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <User size={14} />
              {order.UserID}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
            <XCircle size={14} />
            Declined
          </span>
        </div>

        {/* Image */}
        {order.ItemImages ? (
          <div className="mb-4 -mx-5">
            <img
              src={order.ItemImages}
              alt={order.ItemName}
              className="w-full h-48 object-cover rounded-t-2xl"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x200?text=Image+Not+Found";
              }}
            />
          </div>
        ) : (
          <div className="mb-4 -mx-5 bg-gray-100 h-48 rounded-t-2xl flex items-center justify-center">
            <ImageIcon size={40} className="text-gray-400" />
          </div>
        )}

        {/* Details Grid */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center gap-1">
              <ShoppingBag size={14} />
              Service
            </span>
            <span className="font-medium text-gray-800">{order.ItemName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Type</span>
            <span className="font-medium capitalize">{order.OrderType}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center gap-1">
              <IndianRupee size={14} />
              Price
            </span>
            <span className="font-semibold text-red-600">₹{order.Price}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Quantity</span>
            <span className="font-medium">{order.Quantity}</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-600 flex items-center gap-1">
              <MapPin size={14} />
              Address
            </span>
            <span className="font-medium text-right max-w-[60%] text-gray-700">
              {order.Address || "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center gap-1">
              <Calendar size={14} />
              Slot
            </span>
            <span className="font-medium">{order.Slot || "N/A"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center gap-1">
              <Clock size={14} />
              Slot Time
            </span>
            <span className="font-medium text-xs">
              {order.SlotDatetime ? formatDate(order.SlotDatetime) : "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center gap-1">
              <Clock size={14} />
              Ordered
            </span>
            <span className="font-medium text-xs">
              {order.OrderDatetime ? formatDate(order.OrderDatetime) : "N/A"}
            </span>
          </div>
        </div>

        {/* Footer Badge */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-semibold text-center flex items-center justify-center gap-1.5">
            <AlertCircle size={16} />
            Order Was Declined
          </div>
        </div>
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
        <div className="flex justify-between mb-4">
          <div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/6"></div>
        </div>
        <div className="mt-4 pt-3 border-t">
          <div className="h-8 bg-gray-200 rounded-full"></div>
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
      <XCircle size={48} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      No Declined Orders
    </h3>
    <p className="text-gray-500 max-w-md mx-auto">
      Orders you decline will appear here for your records.
    </p>
  </motion.div>
);

export default DeclinedScreen;
