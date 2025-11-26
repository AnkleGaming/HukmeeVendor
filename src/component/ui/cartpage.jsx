import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GetOrder from "../../backend/order/getorderid";
import DeleteOrder from "../../backend/order/deleteorder";
import UpdateQuantity from "../../backend/order/updateorder";

const CartPage = () => {
  const [orders, setOrders] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null); // New state for quantity update loading
  const UserID = localStorage.getItem("userPhone");
  const navigate = useNavigate();

  // Fetch cart orders
  const fetchCartOrders = useCallback(async () => {
    if (!UserID) return;
    setIsCartLoading(true);
    try {
      const data = await GetOrder(UserID, "Pending");
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setIsCartLoading(false);
    }
  }, [UserID]);

  useEffect(() => {
    fetchCartOrders();
  }, [fetchCartOrders]);

  const handleRemove = async (id) => {
    setDeletingItemId(id);

    // Optimistic remove
    setOrders((prev) => prev.filter((item) => item.ID !== id));

    try {
      await DeleteOrder(id);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingItemId(null);
    }
  };

  // Update quantity (uses OrderID)
  // Update quantity (uses OrderID)
  const handleUpdateQuantity = async (orderId, newQty) => {
    const orderToUpdate = orders.find((item) => item.OrderID === orderId);
    if (!orderToUpdate) return;

    // Optimistic update
    setOrders((prev) =>
      prev.map((item) =>
        item.OrderID === orderId ? { ...item, Quantity: newQty } : item
      )
    );

    setUpdatingItemId(orderId);

    try {
      await UpdateQuantity({
        OrderID: orderToUpdate.OrderID,
        UserID: orderToUpdate.UserID || UserID,
        OrderType: orderToUpdate.OrderType || "Pending",
        ItemImages: "",
        ItemName: "",
        Price: "",
        Quantity: newQty,
        Address: "",
        Slot: "",
        SlotDatetime: "",
        OrderDatetime: "",
      });

      // Add artificial delay (2s)
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (err) {
      console.error("Update quantity failed:", err);

      // Rollback if API fails
      setOrders((prev) =>
        prev.map((item) =>
          item.OrderID === orderId
            ? { ...item, Quantity: orderToUpdate.Quantity }
            : item
        )
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Total & Discounts
  const total = useMemo(
    () =>
      orders.reduce(
        (acc, item) => acc + Number(item.Price) * Number(item.Quantity),
        0
      ),
    [orders]
  );

  const totalDiscount = useMemo(
    () =>
      orders.reduce((acc, item) => {
        const original = Number(item.Price) || 0;
        const discounted = Number(item.DiscountPrice) || original;
        const qty = Number(item.Quantity) || 1;
        return acc + (original - discounted) * qty;
      }, 0),
    [orders]
  );

  const handleProceed = () => {
    navigate("/paymentpage", {
      state: {
        cartItems: orders,
        total,
        totalDiscount,
      },
    });
  };

  const isMobile = window.innerWidth < 640;

  return (
    <div className="w-full md:w-80 lg:w-96 mx-auto bg-white rounded-2xl shadow-lg overflow-hidden font-sans">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Your Cart
        </h2>

        {isCartLoading ? (
          <div
            className="flex justify-center items-center py-4"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="ml-3 text-gray-500 text-base sm:text-lg">
              Loading cart...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 sm:py-12">
            <p className="text-gray-500 text-base sm:text-lg mb-2">
              No items in your cart
            </p>
            <p className="text-gray-400 text-sm">
              Add some services to get started!
            </p>
          </div>
        ) : (
          orders.map((item) => (
            <div
              key={item.ID}
              className="flex justify-between items-start mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100 last:mb-0 last:pb-0 last:border-0"
            >
              {/* Left: Item Details */}
              <div className="flex-grow pr-3 sm:pr-4">
                <p className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
                  {item.ItemName}
                </p>
                {item.duration && (
                  <p className="text-xs text-gray-500 mt-1">{item.duration}</p>
                )}
                <button
                  onClick={() => handleRemove(item.ID)}
                  disabled={deletingItemId === item.ID}
                  className="flex items-center text-indigo-600 text-sm mt-2 hover:text-indigo-800 transition-colors duration-200 disabled:opacity-50"
                  aria-label={
                    deletingItemId === item.ID
                      ? `Removing ${item.ItemName}`
                      : `Remove ${item.ItemName}`
                  }
                  aria-busy={deletingItemId === item.ID}
                >
                  {deletingItemId === item.ID ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-600 mr-1" />
                  ) : (
                    <Trash2 size={14} className="mr-1" />
                  )}
                  {deletingItemId === item.ID ? "Removing..." : "Remove"}
                </button>
              </div>

              {/* Right: Quantity & Price */}
              <div
                className="flex flex-col items-end"
                aria-busy={updatingItemId === item.OrderID}
              >
                <div className="flex items-center bg-gray-50 rounded-full px-2 py-1 gap-2 sm:gap-3 text-sm font-medium text-gray-700 shadow-sm">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.OrderID,
                        Math.max(1, Number(item.Quantity) - 1)
                      )
                    }
                    disabled={
                      Number(item.Quantity) <= 1 ||
                      updatingItemId === item.OrderID
                    }
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200 disabled:opacity-50"
                    aria-label={`Decrease quantity of ${item.ItemName}`}
                    aria-disabled={
                      Number(item.Quantity) <= 1 ||
                      updatingItemId === item.OrderID
                    }
                  >
                    <Minus size={16} />
                  </button>
                  {updatingItemId === item.OrderID ? (
                    <div className="w-6 sm:w-8 text-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-600" />
                    </div>
                  ) : (
                    <span className="w-6 sm:w-8 text-center">
                      {item.Quantity}
                    </span>
                  )}
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.OrderID,
                        Number(item.Quantity) + 1
                      )
                    }
                    disabled={updatingItemId === item.OrderID}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200 disabled:opacity-50"
                    aria-label={`Increase quantity of ${item.ItemName}`}
                    aria-disabled={updatingItemId === item.OrderID}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-base sm:text-lg font-bold text-indigo-600 mt-2 sm:mt-3">
                  ₹{(Number(item.Price) * Number(item.Quantity)).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary */}
      {orders.length > 0 && (
        <>
          {isMobile ? (
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-300 shadow-lg">
              <button
                onClick={handleProceed}
                className="w-full flex items-center justify-between bg-indigo-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200"
                aria-label="Proceed to payment"
              >
                <span className="text-sm sm:text-base font-semibold">
                  Total: ₹{total.toFixed(2)}
                </span>
                <span className="text-sm sm:text-base font-semibold">
                  Proceed to Pay
                </span>
              </button>
            </div>
          ) : (
            <div className="w-full p-4 sm:p-6 bg-white border-t border-gray-200">
              <div className="mb-4">
                <div className="flex justify-between text-base sm:text-lg font-semibold text-gray-900">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm sm:text-base text-green-600 mt-1">
                    <span>Discount</span>
                    <span>-₹{totalDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleProceed}
                className="w-full flex items-center justify-between bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200"
                aria-label="Proceed to payment"
              >
                <span className="text-base sm:text-lg font-semibold">
                  ₹{total.toFixed(2)}
                </span>
                <span className="text-base sm:text-lg font-semibold">
                  Proceed to Pay
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
