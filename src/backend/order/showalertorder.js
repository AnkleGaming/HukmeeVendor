import axios from "axios";

// Correct Model Class Name
class GetAlertOrderModel {
  constructor(
    ID,
    OrderID,
    UserID,
    OrderType,
    ItemImages,
    ItemName,
    Price,
    Quantity,
    Address,
    Slot,
    SlotDatetime,
    OrderDatetime,
    Status,
    VendorPhone,
    BeforVideo,
    AfterVideo,
    OTP,
    PaymentMethod,
    lat,
    lon
  ) {
    this.ID = ID;
    this.OrderID = OrderID;
    this.UserID = UserID;
    this.OrderType = OrderType;
    this.ItemImages = ItemImages;
    this.ItemName = ItemName;
    this.Price = Price;
    this.Quantity = Quantity;
    this.Address = Address;
    this.Slot = Slot;
    this.SlotDatetime = SlotDatetime;
    this.OrderDatetime = OrderDatetime;
    this.Status = Status;
    this.VendorPhone = VendorPhone;
    this.BeforVideo = BeforVideo;
    this.AfterVideo = AfterVideo;
    this.OTP = OTP;
    this.PaymentMethod = PaymentMethod;
    this.lat = lat;
    this.lon = lon;
  }

  static fromJson(json) {
    const imageUrl = json.ItemImages
      ? json.ItemImages.startsWith("http")
        ? json.ItemImages
        : `https://weprettify.com/Images/${json.ItemImages}`
      : "";

    return new GetAlertOrderModel(
      json.ID || 0,
      json.OrderID || "",
      json.UserID || "",
      json.OrderType || "",
      imageUrl,
      json.ItemName || json.ServiceName || "Unknown Service", // fallback
      json.Price || "0",
      json.Quantity || "1",
      json.Address || "Not provided",
      json.Slot || "",
      json.SlotDatetime || "",
      json.OrderDatetime || "",
      json.Status || "Pending",
      json.VendorPhone || "",
      json.BeforVideo || "",
      json.AfterVideo || "",
      json.OTP || "",
      json.PaymentMethod || "",
      json.lat || "",
      json.lon || ""
    );
  }
}

// Correct function name & mapping
const GetAlertOrder = async (orderId) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("OrderID", orderId);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowOrdersAlert",
      formData,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    let rawData = response.data;

    // Handle string JSON response
    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch (e) {
        console.error("Failed to parse JSON string:", rawData);
        return [];
      }
    }

    // Final safety
    if (!rawData || !Array.isArray(rawData)) {
      console.log("No items found for OrderID:", orderId);
      return [];
    }

    // Use correct model
    return rawData.map((item) => GetAlertOrderModel.fromJson(item));
  } catch (error) {
    console.error("Error in GetAlertOrder:", error.message || error);
    return [];
  }
};

export default GetAlertOrder;
export { GetAlertOrderModel };
