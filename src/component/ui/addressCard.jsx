import React, { useState, useEffect } from "react";
import InsertAddress from "../../backend/address/insertaddress";
import GetAddress from "../../backend/address/getaddress";

const AddressFormCard = ({ onClose, onSelectAddress }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const fetchedAddresses = await GetAddress("7700818001");
        setAddresses(fetchedAddresses || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setMessage("Failed to load addresses. Please try again later.");
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await InsertAddress(
        formData.name,
        "7700818001",
        formData.address,
        formData.city,
        formData.pincode
      );
      if (response && response.message === "Inserted Successfully!") {
        setMessage("Address saved successfully!");
        setFormData({
          name: "",
          address: "",
          state: "",
          city: "",
          pincode: "",
        });
        const fetchedAddresses = await GetAddress("7700818001");
        setAddresses(fetchedAddresses || []);
        setShowForm(false);
        setTimeout(() => {
          setIsOpen(false);
          onClose?.();
        }, 1500);
      } else {
        setMessage("Failed to save address. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      setMessage("An error occurred while saving the address.");
      setIsLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id);
    onSelectAddress(address);
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`max-w-md mx-auto p-6 sm:p-8 bg-white shadow-xl rounded-2xl border border-gray-100 font-sans transition-all duration-500 h-[450px] ${
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Add New Address
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="Add New Address"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
          </button>
        )}
      </div>
      <div className="max-h-[calc(100%-3rem)] overflow-y-auto hide-scrollbar">
        {showForm && (
          <>
            {message && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  message.includes("success")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Address
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    State
                  </label>
                  <input
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    City
                  </label>
                  <input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Pincode
                </label>
                <input
                  name="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center justify-center ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
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
                      Saving...
                    </>
                  ) : (
                    "Save Address"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="py-3 px-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50/50 hover:bg-indigo-100 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Saved Addresses
          </h3>
          {addresses.length === 0 ? (
            <p className="text-gray-600">No addresses found.</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 bg-gray-50/50 border rounded-lg shadow-sm cursor-pointer transition-all duration-300 ${
                    selectedAddressId === address.id
                      ? "border-indigo-500 bg-indigo-50/50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                  onClick={() => handleSelectAddress(address)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        <span className="font-semibold">Name:</span>{" "}
                        {address.Name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Address:</span>{" "}
                        {address.Address}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">City:</span>{" "}
                        {address.City}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Pincode:</span>{" "}
                        {address.PinCode}
                      </p>
                    </div>
                    {selectedAddressId === address.id && (
                      <svg
                        className="h-5 w-5 text-indigo-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressFormCard;
