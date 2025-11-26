import axios from "axios";

const DeclineLeads = async (orderId, vendorPhone) => {
  // prepare form data
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("OrderID", orderId);
  formData.append("VendorPhone", vendorPhone);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/DeclineLead",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let rawData = response.data;

    // handle string JSON responses
    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch {
        console.warn("Response is not valid JSON:", rawData);
      }
    }

    console.log("✅ DeclineLead Response:", rawData);
    return rawData;
  } catch (error) {
    console.error("❌ Error calling DeclineLead API:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export default DeclineLeads;
