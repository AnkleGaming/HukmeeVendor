import React, { useState, useEffect } from "react";
import GetReferDetailsh from "../../backend/refer/getreferdetailsh";
import CheckReferCode from "../../backend/checkrefercode/checkrefercode";

const EnterReferCode = () => {
  const [referDetails, setReferDetails] = useState([]);
  const phone = localStorage.getItem("userPhone");
  const [inputCode, setInputCode] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReferDetails = async () => {
      try {
        const data = await GetReferDetailsh(phone);
        console.log("Fetched refer details: ", data);
        setReferDetails(data || []);

        if (data && data.length > 0) {
          // If FriendCode already exists, lock the field
          if (data[0].FriendCode && data[0].FriendCode.trim() !== "") {
            setInputCode(data[0].FriendCode);
            setDisabled(true);
          }
        }
      } catch (error) {
        console.error("Error fetching refer details:", error);
      }
    };

    if (phone) fetchReferDetails();
  }, [phone]);

  const handleSubmit = async () => {
    if (inputCode.trim() === "") {
      setMessage("⚠️ Please enter a referral code");
      return;
    }

    if (referDetails.length > 0) {
      const myOwnCode = referDetails[0]?.ReferCode;

      // ❌ Prevent using own code
      if (inputCode.trim() === myOwnCode) {
        setMessage("❌ Invalid referral code (You cannot use your own code)");
        return;
      }
    }

    try {
      setLoading(true);
      const resultMessage = await CheckReferCode(inputCode.trim(), phone);

      if (resultMessage === "Updated!") {
        setMessage("✅ Referral code applied successfully");
        setDisabled(true);
      } else if (resultMessage === "ReferCode Not Matched!") {
        setMessage("❌ Given referral code is not valid");
      } else {
        setMessage("⚠️ Something went wrong: " + resultMessage);
      }
    } catch (error) {
      console.error("Error checking referral code:", error);
      setMessage("⚠️ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-1">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-3 sm:p-8 flex flex-col items-center">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-6">
          Enter Referral Code
        </h2>

        {/* Text Field */}
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Enter your referral code"
          disabled={disabled || loading}
          className={`w-full border rounded-xl p-3 mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
            disabled ? "bg-gray-200 cursor-not-allowed" : ""
          }`}
        />

        {/* Submit Button */}
        {!disabled && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full sm:w-auto ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            } text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}
          >
            {loading ? "Checking..." : "Submit"}
          </button>
        )}

        {message && (
          <p
            className={`mt-4 text-sm font-medium ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EnterReferCode;
