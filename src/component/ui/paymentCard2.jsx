// PaymentCard2.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import GetOrder from "../../backend/order/getorderid";
import UpdateQuantity from "../../backend/order/updateorder";
import DeleteOrder from "../../backend/order/deleteorder";

const PaymentCard2 = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const UserID = localStorage.getItem("userPhone");

  // Fetch cart items on mount
  const fetchCart = async () => {
    if (!UserID) return;
    setIsLoading(true);
    try {
      const data = await GetOrder(UserID, "Pending");
      setCartItems(data);
    } catch (err) {
      console.error("Error fetching cart items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity locally and call API
  const handleUpdateQuantity = async (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.ID === id ? { ...item, Quantity: newQty } : item
      )
    );
    try {
      await UpdateQuantity(id, newQty);
    } catch (err) {
      console.error("Quantity update failed:", err);
    }
  };

  // Remove item locally and call API
  const handleRemove = async (id) => {
    setDeletingItemId(id);
    setCartItems((prev) => prev.filter((item) => item.ID !== id));
    try {
      await DeleteOrder(id);
    } catch (err) {
      console.error("Delete item failed:", err);
    } finally {
      setDeletingItemId(null);
    }
  };

  // Calculate total price
  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + Number(item.Price) * Number(item.Quantity),
      0
    );
  }, [cartItems]);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading cart items...</div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <h2 className="text-lg sm:text-xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Your Cart
      </h2>

      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div
            key={item.ID}
            className="flex md:flex-row sm:flex-row sm:items-center justify-between mb-4 gap-4 border-b border-gray-200 pb-4"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {item.ItemName}
              </p>
              {item.duration && (
                <p className="text-xs text-gray-600 mt-1">{item.duration}</p>
              )}
              {/* <button
                onClick={() => handleRemove(item.ID)}
                disabled={deletingItemId === item.ID}
                className="mt-2 text-red-600 text-xs hover:text-red-800 disabled:opacity-50 flex items-center gap-1"
              >
                {deletingItemId === item.ID ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-red-600" />
                ) : (
                  <Trash2 size={12} />
                )}
                {deletingItemId === item.ID ? "Removing..." : "Remove"}
              </button> */}
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center border border-indigo-200 bg-indigo-50 rounded-full px-2 py-1 gap-2 text-xs font-medium hover:border-indigo-300 transition-all">
                <span className="w-5 text-center font-semibold">
                  {item.Quantity}
                </span>
              </div>
              <p className="text-sm font-bold mt-2 text-gray-900">
                ₹{Number(item.Price) * Number(item.Quantity)}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 text-sm py-4">
          Your cart is empty.
        </p>
      )}

      {/* Total */}
      {cartItems.length > 0 && (
        <div className="mt-4 text-right">
          <p className="text-lg font-semibold">
            Total: <span className="text-indigo-600">₹{totalPrice}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentCard2;
