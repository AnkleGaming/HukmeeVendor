import React, { useState, useEffect } from "react";
import GetInTouch from "../../backend/footer/getintouch";
import Colors from "../core/constant";

const ContactInfo = () => {
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setIsLoading(true);
        const data = await GetInTouch();
        // Assuming the API returns an array, take the first item
        setContact(data.length > 0 ? data[0] : null);
      } catch (err) {
        console.error("Error fetching contact:", err);
        setError("Failed to load contact information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-sans">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <h2
          className={`text-2xl md:text-3xl font-bold bg-${Colors.primaryMain} bg-clip-text text-transparent p-6`}
        >
          Contact Information
        </h2>
        <div className="p-6">
          {contact ? (
            <div className="grid grid-cols-1 gap-4 text-sm md:text-base">
              {/* <div className="flex items-center">
                <span className="w-32 font-medium text-indigo-600">ID:</span>
                <span className="text-gray-900">{contact.ID}</span>
              </div> */}
              <div className="flex items-center">
                <span className={`w-32 font-medium text-${Colors.primaryMain}`}>
                  Phone:
                </span>
                <a
                  href={`tel:${contact.Phone}`}
                  className={`text-${Colors.primaryMain} hover:underline`}
                >
                  {contact.Phone}
                </a>
              </div>
              <div className="flex items-center">
                <span className={`w-32 font-medium text-${Colors.primaryMain}`}>
                  Email:
                </span>
                <a
                  href={`mailto:${contact.Email}`}
                  className={`text-${Colors.primaryMain} hover:underline`}
                >
                  {contact.Email}
                </a>
              </div>
              <div className="flex items-center">
                <span className={`w-32 font-medium text-${Colors.primaryMain}`}>
                  Address:
                </span>
                <span className="text-gray-900">
                  {contact.Address || "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`w-32 font-medium text-${Colors.primaryMain}`}>
                  Instagram:
                </span>
                <a
                  href={contact.Link1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-${Colors.primaryMain} hover:underline`}
                >
                  {contact.Link1 || "N/A"}
                </a>
              </div>
              <div className="flex items-center">
                <span className={`w-32 font-medium text-${Colors.primaryMain}`}>
                  Facebook:
                </span>
                <a
                  href={contact.Link2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-${Colors.primaryMain} hover:underline`}
                >
                  {contact.Link2 || "N/A"}
                </a>
              </div>
              <div className="flex items-center">
                <span className={`w-32 font-medium text-${Colors.primaryMain}`}>
                  Telegram:
                </span>
                <a
                  href={contact.Link3}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-${Colors.primaryMain} hover:underline`}
                >
                  {contact.Link3 || "N/A"}
                </a>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              No contact information available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
