import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import GetAddress from "../../backend/address/getaddress";

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const phone = localStorage.getItem("userPhone") || "";

  const fields = [
    { label: "Name", key: "Name" },
    { label: "Phone", key: "Phone" },
    { label: "Address", key: "Address" },
    { label: "City", key: "City" },
    { label: "Pin Code", key: "PinCode" },
    { label: "User Phone", key: "Userph" },
  ];

  const fetchAddresses = async () => {
    setLoading(true);
    const data = await GetAddress(phone);
    setAddresses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleEditClick = (address) => {
    console.log("Edit clicked for:", address);
    // You can open a modal here
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading address list...
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        No address details found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-gray-600 font-semibold">
              Name
            </th>
            <th className="px-6 py-3 text-left text-gray-600 font-semibold">
              City
            </th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address, index) => (
            <React.Fragment key={address.id || index}>
              {/* Row */}
              <tr className="hover:bg-gray-50 transition-colors duration-200">
                <td
                  className="px-6 py-4 cursor-pointer text-gray-800 font-medium"
                  onClick={() => toggleExpand(index)}
                >
                  {address.Name || "-"}
                </td>
                <td
                  className="px-6 py-4 cursor-pointer text-gray-600"
                  onClick={() => toggleExpand(index)}
                >
                  {address.City || "-"}
                </td>
              </tr>

              {/* Expanded Row */}
              {expandedIndex === index && (
                <tr>
                  <td colSpan="3" className="bg-gray-50 px-6 py-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                        Address Details
                      </h3>
                      <button
                        onClick={() => handleEditClick(address)}
                        className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition font-medium"
                        aria-label="Edit address details"
                      >
                        <FaEdit /> Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {fields.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
                        >
                          <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                            {item.label}
                          </span>
                          <span className="text-base font-medium text-gray-900 mt-1">
                            {address[item.key] || "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddressList;
