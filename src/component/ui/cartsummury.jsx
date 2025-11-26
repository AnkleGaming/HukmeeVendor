import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const CartSummary = ({ total, cartItems }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);


  const totalDiscount = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const original = Number(item.Price) || 0;
      const discounted = Number(item.DiscountPrice) || original;
      const qty = Number(item.Quantity) || 1;
      return acc + (original - discounted) * qty;
    }, 0);
  }, [cartItems]);

  const handleCart = () => {
    console.log("Navigating to payment with:", {
      cartItems,
      total,
      totalDiscount,
    });
    navigate("/paymentpage", {
      state: {
        cartItems,
        total,
        totalDiscount,
      },
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  // ✅ Mobile summary (sticky bottom)
  const MobileSummary = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-300 shadow-lg">
      <button
        onClick={handleCart}
        className="w-full flex items-center justify-between bg-indigo-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200"
      >
        <span className="text-sm sm:text-base font-semibold">
          Total Items: {cartItems.length}
        </span>
        <span className="text-sm sm:text-base font-semibold">View Cart</span>
      </button>
    </div>
  );

  // ✅ Desktop summary
  const DesktopSummary = () => (
    <div className="w-full p-4 sm:p-6 bg-white border-t border-gray-200">
      <div className="mb-4">
        <div className="flex justify-between text-base sm:text-lg font-semibold text-gray-900">
          <span>Subtotal</span>
          <span>₹{Number(total).toFixed(2)}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-sm sm:text-base text-green-600 mt-1">
            <span>Discount</span>
            <span>-₹{totalDiscount.toFixed(2)}</span>
          </div>
        )}
      </div>
      <button
        onClick={handleCart}
        className="w-full flex items-center justify-between bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200"
      >
        <span className="text-base sm:text-lg font-semibold">
          ₹{Number(total).toFixed(2)}
        </span>
        <span className="text-base sm:text-lg font-semibold">
          Proceed to Pay
        </span>
      </button>
    </div>
  );

  return isMobile ? <MobileSummary /> : <DesktopSummary />;
};

export default CartSummary;
