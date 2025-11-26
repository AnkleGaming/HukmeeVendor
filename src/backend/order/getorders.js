import axios from "axios";

// Order model
class GetOrderModel {
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
    PaymentMethod
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
  }

  static fromJson(json) {
    // Use placeholder if no image
    const imageUrl = json.ItemImages
      ? json.ItemImages.startsWith("http")
        ? json.ItemImages
        : `https://weprettify.com/Images/${json.ItemImages}`
      : "";

    return new GetOrderModel(
      json.ID || 0,
      json.OrderID || "",
      json.UserID || "",
      json.OrderType || "",
      imageUrl,
      json.ItemName || "",
      json.Price || "",
      json.Quantity || "",
      json.Address || "",
      json.Slot || "",
      json.SlotDatetime || "",
      json.OrderDatetime || "",
      json.Status || "",
      json.VendorPhone || "",
      json.BeforVideo || "",
      json.AfterVideo || "",
      json.OTP || "",
      json.PaymentMethod || ""
    );
  }
}

// Fetch orders
const GetOrders = async (VendorPhone, Status) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("OrderID", "");
  formData.append("UserID", "");
  formData.append("VendorPhone", VendorPhone);
  formData.append("Status", Status);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowOrders",
      formData,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    let rawData = response.data;

    // Parse if string
    if (typeof rawData === "string") {
      rawData = JSON.parse(rawData);
    }

    if (!Array.isArray(rawData)) return [];

    return rawData.map((item) => GetOrderModel.fromJson(item));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export default GetOrders;
export { GetOrderModel };
