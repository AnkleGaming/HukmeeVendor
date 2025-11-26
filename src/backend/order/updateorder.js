import axios from "axios";

const UpdateOrder = async ({
  OrderID,
  Price,
  Quantity,
  UserID,
  OrderType,
  ItemImages = "",
  ItemName,
  Address = "",
  Slot = "",
  SlotDatetime = "",
  OrderDatetime = new Date().toISOString(),
}) => {
  // Create form data in key-value pairs exactly as API expects
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("OrderID", OrderID);
  formData.append("Price", Price);
  formData.append("Quantity", Quantity);
  formData.append("UserID", UserID);
  formData.append("OrderType", OrderType);
  formData.append("ItemImages", ItemImages);
  formData.append("ItemName", ItemName);
  formData.append("Address", Address);
  formData.append("Slot", Slot);
  formData.append("SlotDatetime", SlotDatetime);
  formData.append("OrderDatetime", OrderDatetime);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/UpdateOrders",
      formData.toString(), // convert form data to string
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("InsertOrder Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
};

export default UpdateOrder;
