// PaymentCardButton.jsx
import React, { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

const PaymentCardButton = ({
  itemTotal = 0,
  calculateTotal = () => itemTotal,
  onProceed,
  loading = false,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const fmt = (v) => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(v) || 0);
    } catch {
      return `₹${Number(v) || 0}`;
    }
  };

  // total = just sum of items
  const finalTotal = useMemo(
    () => calculateTotal(),
    [calculateTotal, itemTotal]
  );

  return (
    <div className="w-full max-w-md mx-auto p-5 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Payment Summary</h3>
            <p className="text-xs text-gray-500">Review before proceeding</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Subtotal</div>
          <div className="text-lg font-semibold text-indigo-600">
            {fmt(finalTotal)}
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between items-center">
          <span className="font-medium">Items Total</span>
          <span className="text-gray-900 font-semibold">{fmt(itemTotal)}</span>
        </div>

        <hr className="my-2 border-gray-200" />

        <div className="flex justify-between items-center font-semibold text-gray-800">
          <span>Total Amount</span>
          <span className="text-indigo-500">{fmt(finalTotal)}</span>
        </div>

        {/* Toggle Breakdown */}
        <div className="flex items-center justify-between gap-3 mt-3">
          <button
            onClick={() => setShowBreakdown((s) => !s)}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium hover:shadow-sm transition"
            aria-expanded={showBreakdown}
          >
            {showBreakdown ? "Hide Details" : "View Details"}
          </button>
        </div>

        {/* Breakdown Expanded */}
        {showBreakdown && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{fmt(itemTotal)}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between font-semibold">
              <span>Payable</span>
              <span>{fmt(finalTotal)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Proceed Button */}
      {/* <div className="mt-5">
        <button
          onClick={onProceed}
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium shadow bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Proceed to Pay"}
        </button>
      </div> */}
    </div>
  );
};

export default PaymentCardButton;
