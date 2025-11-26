import React, { useState, useEffect } from "react";
import referimage from "../../assets/refer.jpg";
import GetReferDetailsh from "../../backend/refer/getreferdetailsh";

const ReferAndEarn = () => {
  const [referDetails, setReferDetails] = useState([]);
  const phone = localStorage.getItem("userPhone");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferDetails = async () => {
      try {
        const data = await GetReferDetailsh(phone);
        console.log("Fetched refer details: ", { data });
        setReferDetails(data || []);
      } catch (error) {
        console.error("Error fetching refer details:", error);
      }
    };
    if (phone) fetchReferDetails();
  }, [phone]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Join Our Hukmee Platform!",
          text: "Invite your friends to join our courses and earn exciting rewards!",
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Copy this link to share: " + window.location.href);
    }
  };

  const handleCopy = () => {
    if (referDetails[0]?.ReferCode) {
      navigator.clipboard.writeText(referDetails[0].ReferCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    }
  };

  return (
    <div className=" bg-gray-100 flex items-center justify-center p-1">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-2 sm:p-8 flex flex-col items-center">
        {/* Referral Image */}
        <img
          src={referimage}
          alt="Refer and Earn"
          className="w-full h-48 sm:h-56 object-cover rounded-xl mb-6"
        />

        {/* Title and Description */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-4">
          Refer & Earn
        </h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
          Invite your friends to join our Weprettify and earn exciting rewards
          for every successful referral!
        </p>

        {/* Referral Code Section */}
        {referDetails.length > 0 && (
          <div className="w-full bg-gray-100 border rounded-xl p-4 mb-6 flex justify-between items-center">
            <span className="font-semibold text-gray-800">
              {referDetails[0].ReferCode}
            </span>
            <button
              onClick={handleCopy}
              className="ml-4 px-3 py-1 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Share Now
        </button>
      </div>
    </div>
  );
};

export default ReferAndEarn;
