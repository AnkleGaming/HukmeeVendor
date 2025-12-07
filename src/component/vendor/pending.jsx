import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GetOrders from "../../backend/order/getorders";
import COLORS from "../core/constant";
import {
  CheckCircle,
  Package,
  Clock,
  User,
  IndianRupee,
  ShoppingBag,
  Calendar,
} from "lucide-react";

const PendingScreen = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const UserID = localStorage.getItem("userPhone");

  // Prevent body scroll if needed (not used here, but kept for consistency)
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Fetch completed orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!UserID) return;
      setIsLoading(true);
      try {
        const data = await GetOrders("", UserID, "Pending1");
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [UserID]);

  return (
    <div className={`${COLORS.bgGray} min-h-screen py-6 px-4`}>
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${COLORS.gradientFrom} ${COLORS.gradientTo} bg-clip-text text-transparent mb-8 text-center`}
        >
          Pending Orders
        </motion.h1>

        {isLoading ? (
          <LoadingSkeleton />
        ) : orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {orders.map((order, index) => (
                <CompletedOrderCard
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
// Completed Order Card
// ==========================
const CompletedOrderCard = ({ order, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
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
            <h3 className="font-bold text-l text-gray-800 flex items-center gap-2">
              <Package size={18} />#{order.OrderID}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <User size={14} />
              {order.UserID}
            </p>
          </div>
          {/* <span className="px-3 py-1 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1">
            <CheckCircle size={14} />
            Completed
          </span> */}
        </div>

        {/* Order Details */}
        <div className="space-y-3 text-sm border-t border-gray-100 pt-3">
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
            <span className="font-semibold text-emerald-600">
              ₹{order.Price}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Quantity</span>
            <span className="font-medium">{order.Quantity}</span>
          </div>
        </div>

        {/* Completion Time */}
        {order.CompletedAt && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={14} />
              Completed on {formatDate(order.CompletedAt)}
            </p>
          </div>
        )}

        {/* Success Badge */}
        <div className="mt-4 flex justify-center">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle size={16} />
            Pending
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
        <div className="space-y-3 pt-3 border-t">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/6"></div>
        </div>
        <div className="mt-4 pt-3 border-t">
          <div className="h-3 bg-gray-200 rounded w-40 mx-auto"></div>
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
      <CheckCircle size={48} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      No Pending Orders
    </h3>
    <p className="text-gray-500 max-w-md mx-auto">
      Once you mark orders as pending, they will appear here.
    </p>
  </motion.div>
);

export default PendingScreen;
