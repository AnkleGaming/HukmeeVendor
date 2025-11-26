import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, AlertCircle, Shield } from "lucide-react";
import Colors from "../core/constant";

const VendorVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch verification status
    const fetchVerificationStatus = async () => {
      setLoading(true);
      // Mock delay for API call
      setTimeout(() => {
        // Mock data - you can replace with actual API call
        const mockStatus = "pending"; // 'pending', 'verified', 'rejected'
        setVerificationStatus(mockStatus);
        setLoading(false);
      }, 1500);
    };

    fetchVerificationStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${Colors.primaryMain}`}
          ></div>
          <p className="text-gray-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

  const renderStatusContent = () => {
    switch (verificationStatus) {
      case "verified":
        return (
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Verified!</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Congratulations! Your vendor account has been successfully
              verified. You can now access all features.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Verified Vendor Badge
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full max-w-md py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-300"
            >
              Go to Dashboard
            </button>
          </div>
        );
      case "rejected":
        return (
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Verification Failed
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Unfortunately, your vendor verification was not approved. Please
              review the requirements and try again.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                Common reasons: Incomplete documents, invalid Aadhaar, or
                missing information.
              </p>
            </div>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => navigate("/register")}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              >
                Reapply for Verification
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Contact Support
              </button>
            </div>
          </div>
        );
      case "pending":
      default:
        return (
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Verification Pending
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Your vendor registration is under review. Our team will verify
              your documents within 24-48 hours.
            </p>
            {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Status: Under Review
                </span>
              </div>
              <p className="text-xs text-yellow-700 text-center">
                You will receive an email notification once your verification is
                complete.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/userprofile")}
                className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-300 
    bg-gradient-to-r ${Colors.primaryFrom} ${Colors.primaryTo} 
    ${Colors.hoverFrom} ${Colors.hoverTo}`}
              >
                View Profile
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Contact Support
              </button>
            </div> */}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 text-center">{renderStatusContent()}</div>
        </div>

        {/* Additional info section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <Shield className="w-5 h-5 text-indigo-600 mr-2" />
            Verification Requirements
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Valid Aadhaar card (front & back)
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Complete personal information
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Active phone number
            </li>
            <li className="flex items-center">
              <Clock className="w-4 h-4 text-yellow-500 mr-2" />
              Processing time: 24-48 hours
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VendorVerification;
