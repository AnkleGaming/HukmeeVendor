import axios from "axios";

const InsertHubRequest = async ({
  HubLoginID,
  VendorPhone,
  itemID,
  itemName,
  itemQTY,
}) => {
  // Prepare form data exactly as the API expects
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("HubLoginID", HubLoginID);
  formData.append("VendorPhone", VendorPhone);
  formData.append("itemID", itemID);
  formData.append("itemName", itemName);
  formData.append("itemQTY", itemQTY);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/InsertHubRequest",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // If the response might be JSON as a string, parse it safely
    let rawData = response.data;
    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch {
        // Ignore parse error if not JSON
      }
    }

    return rawData;
  } catch (error) {
    console.error("InsertHubRequest Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
};

export default InsertHubRequest;
