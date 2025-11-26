import React from "react";
import CartPage from "./cartpage";

const CartMain = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <header className="w-full max-w-5xl mb-6 sticky top-0 bg-gray-50 z-10 py-4">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight">
          Your Shopping Cart
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
          Review your items and proceed to checkout
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl bg-white rounded-xl shadow-md p-6 sm:p-8 lg:p-10 transition-all duration-300">
        <CartPage />
      </main>

      {/* Footer Section */}
      <footer className="mt-8 w-full max-w-5xl text-center py-4">
        <p className="text-sm text-gray-500">
          Need help?{" "}
          <a
            href="/support"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Contact Support
          </a>
        </p>
      </footer>
    </div>
  );
};

export default CartMain;
