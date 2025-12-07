import axios from "axios";

const UpdateOrder = async ({
  OrderID,
  Price,
  Quantity,
  Address = "",
  Slot = "",
  Status = "",
  VendorPhone = "",
  BeforVideo = "",
  AfterVideo = "",
  OTP = "",
  PaymentMethod = "",
  AcptVendor = "",
  PayCustomer = "",
  Coupon = "",
  FinalPrice = "",
}) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("OrderID", OrderID);
  formData.append("Price", Price);
  formData.append("Quantity", Quantity);
  formData.append("Address", Address);
  formData.append("Slot", Slot);
  formData.append("Status", Status);
  formData.append("VendorPhone", VendorPhone);
  formData.append("BeforVideo", BeforVideo);
  formData.append("AfterVideo", AfterVideo);
  formData.append("OTP", OTP);
  formData.append("PaymentMethod", PaymentMethod);
  formData.append("AcptVendor", AcptVendor);
  formData.append("PayCustomer", PayCustomer);
  formData.append("Coupon", Coupon);
  formData.append("FinalPrice", FinalPrice);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/UpdateOrders",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("UpdateOrder Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
};

export default UpdateOrder;
