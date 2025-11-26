import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosTime } from "react-icons/io";
import { MdPayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const PaymentCard = ({
  onSelectAddress,
  onSelectSlot,
  onProceedPayment,
  selectedAddress,
  selectedSlot,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const isSlotButtonDisabled = !selectedAddress;
  const isPaymentButtonDisabled = !selectedAddress || !selectedSlot;

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-4 mb-3">
      <Card className="w-12 h-12 rounded-xl border border-gray-100 shadow-sm bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <CardContent className="p-0 w-full h-full flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-600" />
        </CardContent>
      </Card>
      <span className="text-lg font-semibold text-gray-900">{title}</span>
    </div>
  );

  const desktop = (
    <div className="py-8 w-full max-w-lg mx-auto font-sans">
      <div className="rounded-2xl border border-gray-100 bg-white shadow-lg p-6 space-y-8 transition-all duration-300 hover:shadow-xl">
        {/* Top Info */}
        <div className="flex items-center gap-4">
          <Card className="w-12 h-12 rounded-xl border border-gray-100 bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
            <CardContent className="p-0 w-full h-full flex items-center justify-center">
              <FaLocationDot className="w-6 h-6 text-green-600" />
            </CardContent>
          </Card>
          <div>
            <p className="text-base font-semibold text-gray-900">
              Send booking details to
            </p>
            <p className="text-sm text-gray-600">
              +91 {selectedAddress?.Phone || localStorage.getItem("userPhone")}
            </p>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Address */}
        <div>
          <SectionHeader icon={FaLocationDot} title="Address" />
          {selectedAddress ? (
            <div
              onClick={onSelectAddress}
              className="mt-3 p-4 bg-white border border-indigo-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-400 transition-all duration-300"
            >
              <p className="text-sm font-medium text-gray-800">
                <strong>Name:</strong> {selectedAddress.Name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Address:</strong> {selectedAddress.FullAddress}
              </p>
            </div>
          ) : (
            <button
              onClick={onSelectAddress}
              className="w-full mt-3 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-300 transition-all"
            >
              Select an Address
            </button>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Slot */}
        <div>
          <SectionHeader icon={IoIosTime} title="Slot" />
          {selectedSlot ? (
            <div
              onClick={onSelectSlot}
              className="mt-3 p-4 bg-white border border-indigo-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-400 transition-all duration-300"
            >
              <p className="text-sm font-medium text-gray-800">
                <strong>Day:</strong> {selectedSlot.day.label}{" "}
                {selectedSlot.day.date}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Time:</strong> {selectedSlot.time}
              </p>
              {selectedSlot.day.recommended && (
                <p className="text-xs text-yellow-600 mt-1">
                  ⭐ Recommended Slot
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={onSelectSlot}
              disabled={isSlotButtonDisabled}
              className={`w-full mt-3 py-3 rounded-lg font-medium shadow transition-all focus:ring-2 focus:ring-indigo-300 ${
                isSlotButtonDisabled
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:from-indigo-700 hover:to-purple-700"
              }`}
            >
              Select Slot
            </button>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Payment */}
        <div>
          <SectionHeader icon={MdPayment} title="Payment Method" />
          <button
            onClick={onProceedPayment}
            disabled={isPaymentButtonDisabled}
            className={`w-full mt-3 py-3 rounded-lg font-medium shadow transition-all focus:ring-2 focus:ring-indigo-300 ${
              isPaymentButtonDisabled
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:from-indigo-700 hover:to-purple-700"
            }`}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );

  const mobile = (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Selected Summary Tab */}
      {(selectedAddress || selectedSlot) && (
        <div className="mb-2 mx-3 p-3 rounded-lg border border-gray-200 bg-white shadow-md">
          {selectedAddress && (
            <p className="text-xs font-medium text-gray-800 truncate">
              📍 {selectedAddress.FullAddress}
            </p>
          )}
          {selectedSlot && (
            <p className="text-xs text-gray-600">
              ⏰ {selectedSlot.day.label}, {selectedSlot.time}
            </p>
          )}
        </div>
      )}

      {/* Bottom Button */}
      <div className="p-4 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
        <button
          onClick={() => {
            if (!isLoggedIn) {
              navigate("/login");
            } else {
              onSelectAddress();
            }
          }}
          className="w-full py-3 rounded-lg font-medium shadow bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-300"
        >
          {isLoggedIn ? "Add Address & Slot" : "Login to Continue"}
        </button>
      </div>
    </div>
  );

  return <>{isMobile ? mobile : desktop}</>;
};

export default PaymentCard;
