import axios from "axios";

// ✅ Model for GetOrder API
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
    Status
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
  }

  static fromJson(json) {
    return new GetOrderModel(
      json.ID || 0,
      json.OrderID || "",
      json.UserID || "",
      json.OrderType || "",
      json.ItemImages || "",
      json.ItemName || "",
      Number(json.Price) || 0,
      Number(json.Quantity) || 0,
      json.Address || "",
      json.Slot || "",
      json.SlotDatetime || "",
      json.OrderDatetime || "",
      json.Status || ""
    );
  }
}

// ✅ API function to call GetOrder
const GetOrder = async (UserID, Status) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("UserID", UserID);
  formData.append("Status", Status);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/GetOrder",
      formData,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    let rawData = response.data;

    // If response is string, try parsing
    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch (err) {
        console.error("Invalid JSON format in GetOrder response", err);
        return [];
      }
    }

    if (!Array.isArray(rawData)) {
      console.error("Unexpected GetOrder response:", rawData);
      return [];
    }

    // Map into model
    return rawData.map((item) => GetOrderModel.fromJson(item));
  } catch (error) {
    console.error("Error fetching GetOrder:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export default GetOrder;
