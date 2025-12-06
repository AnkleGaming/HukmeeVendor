// components/PersonalDetails.js
import React, { useState, useEffect } from "react";
import { FaEdit, FaTimes, FaSave } from "react-icons/fa";
import GetUser from "../../backend/authentication/getuser";
import UpdateVendor from "../../backend/authentication/updatevendor";
import Colors from "../core/constant";

const PersonalDetails = () => {
  const number = localStorage.getItem("userPhone") || "";
  const [userDetails, setUserDetails] = useState({});
  const [editedDetails, setEditedDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Mark which fields are editable
  const fields = [
    { label: "Name", key: "fullname", editable: true },
    { label: "Mobile No.", key: "phoneNumber", editable: false },
    { label: "Email Id", key: "email", editable: true },
    { label: "Address", key: "Address", editable: true },
    { label: "Date of Birth", key: "dob", editable: true },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await GetUser(number);
        if (userData.length > 0) {
          setUserDetails(userData[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [number]);

  const handleEditClick = () => {
    setEditedDetails(userDetails);
    setIsEditing(true);
  };

  const handleInputChange = (key, value) => {
    setEditedDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const requiredFields = ["fullname", "phoneNumber"];
    const emptyFields = requiredFields.filter(
      (key) => !editedDetails[key] || editedDetails[key].trim() === ""
    );

    if (emptyFields.length > 0) {
      alert("⚠️ Please fill all required fields before saving.");
      return;
    }

    try {
      const res = await UpdateVendor(
        editedDetails.fullname, // Correct key
        editedDetails.email, // Correct key
        editedDetails.phoneNumber, // Correct key
        editedDetails.dob, // Correct key
        editedDetails.Address, // Correct key
        ""
      );

      if (res) {
        alert("✅ User details updated successfully!");
        setUserDetails(editedDetails);
        setIsEditing(false);
      } else {
        alert("❌ Failed to update details. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong while updating.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="w-full space-y-6">
      {!isEditing ? (
        <>
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
              Personal Details
            </h3>
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition font-medium"
            >
              <FaEdit /> Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((item, index) => (
              <div
                key={index}
                className="flex flex-col p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
              >
                <span className="text-sm font-medium text-gray-600 uppercase">
                  {item.label}
                </span>
                <span className="text-base font-medium text-gray-900 mt-1">
                  {userDetails[item.key] || "-"}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
              Edit Personal Details
            </h3>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium"
            >
              <FaTimes /> Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((item, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 uppercase mb-2">
                  {item.label}
                </label>
                {item.key === "dob" ? (
                  <input
                    type="date"
                    value={editedDetails.dob || ""}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
                  />
                ) : (
                  <input
                    type="text"
                    value={editedDetails[item.key] || ""}
                    onChange={(e) =>
                      handleInputChange(item.key, e.target.value)
                    }
                    disabled={!item.editable}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none ${
                      !item.editable
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 mx-auto bg-${Colors.primaryMain} text-white px-6 py-3 rounded-full hover:bg-or transition font-medium`}
            >
              <FaSave /> Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PersonalDetails;
