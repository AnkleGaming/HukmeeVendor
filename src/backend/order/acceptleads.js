import axios from "axios";

const AcceptLeads = async (orderId, vendorPhone) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("OrderID", orderId);
  formData.append("VendorPhone", vendorPhone);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/AcceptLead",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let rawData = response.data;

    // Some .asmx APIs return JSON as a string — handle that
    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch {
        console.warn("Response is not valid JSON:", rawData);
      }
    }

    console.log("✅ AcceptLead Response:", rawData);
    return rawData;
  } catch (error) {
    console.error("❌ Error calling AcceptLead API:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export default AcceptLeads;
