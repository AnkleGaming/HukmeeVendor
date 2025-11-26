import axios from "axios";

const UpdateOrders = async ({
  OrderID,
  Price,
  Quantity,
  Address = "",
  Slot = "",
  Status,
  VendorPhone,
  BeforVideo = "",
  AfterVideo = "",
  OTP = "",
  PaymentMethod = "",
}) => {
  // Prepare parameters in x-www-form-urlencoded format
  const params = new URLSearchParams();
  params.append("token", "SWNCMPMSREMXAMCKALVAALI");
  params.append("OrderID", OrderID);
  params.append("Price", Price);
  params.append("Quantity", Quantity);
  params.append("Address", Address);
  params.append("Slot", Slot);
  params.append("Status", Status);
  params.append("VendorPhone", VendorPhone);
  params.append("BeforVideo", BeforVideo);
  params.append("AfterVideo", AfterVideo);
  params.append("OTP", OTP);
  params.append("PaymentMethod", PaymentMethod);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/UpdateOrders",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // .asmx may return JSON inside text
    let data = response.data;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        data = { message: data };
      }
    }

    console.log("✅ UpdateOrders response:", data);
    return data?.message || "Unknown response";
  } catch (error) {
    console.error("❌ UpdateOrders Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return "Failed to update order.";
  }
};

export default UpdateOrders;
