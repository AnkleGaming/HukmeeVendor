import React, { useState, useEffect } from "react";
import GetOrders from "../../backend/order/getorders";

const MyOrder = () => {
  const [getorder, setGetOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const UserID = localStorage.getItem("userPhone");

  useEffect(() => {
    const fetchgetorder = async () => {
      setIsLoading(true);
      try {
        const data = await GetOrders(UserID, "Accepted"); // you can change Status if needed
        console.log("Fetched Orders: ", data);
        setGetOrder(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setGetOrder([]);
      }
      setIsLoading(false);
    };

    if (UserID) fetchgetorder();
  }, [UserID]);

  return (
    <div className="bg-gray-100 py-10">
      {isLoading ? (
        <div className="text-center text-indigo-600 font-semibold">
          Loading orders...
        </div>
      ) : (
        <OrderDetails orders={getorder} />
      )}
    </div>
  );
};

export default MyOrder;

const OrderDetails = ({ orders }) => {
  const headers = [
    "ID",
    "OrderID",
    "UserID",
    "OrderType",
    "ItemImages",
    "ItemName",
    "Price",
    "Quantity",
    "Address",
    "Slot",
    "SlotDatetime",
    "OrderDatetime",
    "Status",
  ];

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent p-6">
        Order Details
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.ID} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.ID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.OrderID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.UserID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.OrderType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.ItemImages ? (
                      <img
                        src={order.ItemImages}
                        alt={order.ItemName}
                        className="h-12 w-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=Image+Not+Found";
                        }}
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.ItemName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.Price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.Quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.Address || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.Slot || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.SlotDatetime || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.OrderDatetime
                      ? new Date(order.OrderDatetime).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.Status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.Status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
