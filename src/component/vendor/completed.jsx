import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GetOrders from "../../backend/order/getorders";
import COLORS from "../core/constant";
import {
  CheckCircle,
  Package,
  User,
  IndianRupee,
  ShoppingBag,
  Calendar,
  Tag,
} from "lucide-react";

const CompletedScreen = () => {
  const [groupedOrders, setGroupedOrders] = useState([]); // { OrderID, items[], FinalPrice, Coupon, CompletedAt, ... }
  const [isLoading, setIsLoading] = useState(true);
  const UserID = localStorage.getItem("userPhone");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!UserID) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await GetOrders("", UserID, "Completed");

        const grouped = data.reduce((acc, order) => {
          const key = order.OrderID;
          if (!acc[key]) {
            acc[key] = {
              OrderID: order.OrderID,
              UserID: order.UserID,
              PaymentMethod: order.PaymentMethod,
              OrderDatetime: order.OrderDatetime,
              CompletedAt: order.CompletedAt,
              FinalPrice: order.FinalPrice,
              Coupon: order.Coupon,
              items: [],
              originalTotal: 0, // We'll calculate this
            };
          }

          const itemTotal =
            parseFloat(order.Price) * parseInt(order.Quantity || 1);
          acc[key].originalTotal += itemTotal;

          acc[key].items.push({
            ItemName: order.ItemName,
            Quantity: order.Quantity,
            Price: order.Price,
            ItemImages: order.ItemImages,
          });

          return acc;
        }, {});

        const groupedArray = Object.values(grouped)
          .map((group) => ({
            ...group,
            originalTotal: Math.round(group.originalTotal), // Clean number
          }))
          .sort((a, b) => new Date(b.CompletedAt) - new Date(a.CompletedAt));

        setGroupedOrders(groupedArray);
      } catch (error) {
        console.error("Error fetching completed orders:", error);
        setGroupedOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [UserID]);

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
    <div className={`${COLORS.bgGray} min-h-screen py-6 px-4`}>
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${COLORS.gradientFrom} ${COLORS.gradientTo} bg-clip-text text-transparent mb-8 text-center`}
        >
          Completed Orders
        </motion.h1>

        {isLoading ? (
          <LoadingSkeleton />
        ) : groupedOrders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {groupedOrders.map((group, index) => (
                <GroupedOrderCard
                  key={group.OrderID}
                  group={group}
                  index={index}
                  formatDate={formatDate}
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
// Grouped Order Card (Multiple items in one order)
// ==========================
const GroupedOrderCard = ({ group, index, formatDate }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const totalItems = group.items.reduce(
    (sum, item) => sum + parseInt(item.Quantity || 1),
    0
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <Package size={20} />#{group.OrderID}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <User size={14} />
              {group.UserID}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3 mb-4 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-2">
              <ShoppingBag size={15} />
              Items ({totalItems})
            </span>
          </div>

          {group.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium text-gray-800">{item.ItemName}</p>
                  <p className="text-xs text-gray-500">Qty: {item.Quantity}</p>
                </div>
              </div>
              <span className="text-gray-600">₹{item.Price}</span>
            </div>
          ))}
        </div>

        {/* Coupon & Final Price */}
        {/* Coupon & Pricing Section */}
        <div className="space-y-3 text-sm border-t border-dashed border-gray-200 pt-4">
          {/* Original Total */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Original Amount</span>
            <span className="text-gray-500 line-through">
              ₹{group.originalTotal}
            </span>
          </div>

          {/* Coupon Applied */}
          {group.Coupon && (
            <div className="flex justify-between items-center text-emerald-600">
              <span className="flex items-center gap-1">
                <Tag size={14} />
                Coupon Applied
              </span>
              <span className="font-medium">- {group.Coupon}</span>
            </div>
          )}

          {/* Savings Highlight (Optional but awesome UX) */}
          {group.Coupon && group.originalTotal > group.FinalPrice && (
            <div className="flex justify-between items-center text-emerald-600 font-bold">
              <span>You Saved</span>
              <span>₹{group.originalTotal - group.FinalPrice}</span>
            </div>
          )}

          {/* Final Amount */}
          <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-300">
            <span className="text-gray-800 flex items-center gap-1">
              <IndianRupee size={18} />
              Final Amount
            </span>
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              ₹{group.FinalPrice || "0"}
            </span>
          </div>
        </div>

        {/* Payment & Completion Time */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
          <p>
            Paid via:{" "}
            <span className="font-medium text-gray-700">
              {group.PaymentMethod}
            </span>
          </p>
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
        className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-100"
      >
        <div className="flex justify-between mb-4">
          <div className="h-7 bg-gray-200 rounded w-32"></div>
          <div className="h-7 bg-gray-200 rounded-full w-24"></div>
        </div>
        <div className="space-y-4">
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="h-10 bg-gray-200 rounded mt-4"></div>
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
    className="text-center py-20"
  >
    <div className="bg-gray-100 w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center">
      <CheckCircle size={60} className="text-gray-400" />
    </div>
    <h3 className="text-2xl font-bold text-gray-700 mb-3">
      No Completed Orders Yet
    </h3>
    <p className="text-gray-500 max-w-md mx-auto">
      Your completed orders will appear here once services are finished and
      marked as complete.
    </p>
  </motion.div>
);

export default CompletedScreen;
