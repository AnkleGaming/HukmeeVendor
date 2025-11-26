import axios from "axios";

// 🔹 Leads model
class ShowLeadsModel {
  constructor(ID, OrderID, VendorPhone, Status) {
    this.ID = ID;
    this.OrderID = OrderID;
    this.VendorPhone = VendorPhone;
    this.Status = Status;
  }

  static fromJson(json) {
    return new ShowLeadsModel(
      json.id || 0,
      json.OrderID || "",
      json.VendorPhone || "",
      json.Status || ""
    );
  }
}

// 🔹 Fetch leads function
const ShowLeads = async (VendorPhone, Status) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("VendorPhone", VendorPhone);
  formData.append("Status", Status);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowLeads", // 🔹 API endpoint
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let rawData = response.data;

    // In case API returns a JSON string
    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch (err) {
        console.error("Invalid JSON format in ShowLeads response", err);
        return [];
      }
    }

    if (!Array.isArray(rawData)) {
      console.error("Unexpected response format:", rawData);
      return [];
    }

    // Map response to model
    return rawData.map((item) => ShowLeadsModel.fromJson(item));
  } catch (error) {
    console.error("❌ Error fetching ShowLeads:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export default ShowLeads;
export { ShowLeadsModel };
