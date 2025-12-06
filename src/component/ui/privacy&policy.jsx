import React, { useState, useEffect } from "react";
import GetForms from "../../backend/getforms/getforms";
import Colors from "../core/constant";

const PrivacyAndPolicy = () => {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await GetForms("Privacy");
        console.log("Terms info fetched:", data);

        if (Array.isArray(data) && data.length > 0) {
          setTerms(data[0]);
        } else {
          setError("No terms data available.");
        }
      } catch (error) {
        console.log("Fetching footer info error", error);
        setError("Failed to fetch terms data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center justify-center p-2 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-10 transition-all duration-300 hover:shadow-2xl">
        {/* Header */}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <svg
              className={`animate-spin h-10 w-10 text-${Colors.primaryMain}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={`mt-4 bg-${Colors.primaryMain} text-white font-semibold py-2 px-6 rounded-xl hover:bg-orange-600 hover:cursor-pointer transition-all duration-200`}
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && terms && (
          <div className="space-y-8">
            <h2
              className={`text-2xl sm:text-3xl font-bold text-gray-800 border-l-4 border-${Colors.primaryMain} pl-4`}
            >
              {terms.formHeading}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed whitespace-pre-line bg-gray-50 p-6 rounded-lg shadow-sm">
              {terms.formDescription}
            </p>
          </div>
        )}

        {/* Back Button */}
        {/* <div className="mt-10 flex justify-center">
          <a
            href="/"
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Back to Home
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default PrivacyAndPolicy;
