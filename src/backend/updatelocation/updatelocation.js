// src/backend/vendor/UpdateCurrentLocations.js
import axios from "axios";

const UpdateCurrentLocations = async ({ VendorPhone, Lat, Lon }) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("VendorPhone", VendorPhone);
  formData.append("Lat", Lat);
  formData.append("Lon", Lon);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/UpdateCurrentLocations",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Handle both JSON and XML/Plain responses
    let data = response.data;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        // In case it's XML, just return the raw string
      }
    }

    return data?.Message || data || "Unknown response";
  } catch (error) {
    console.error("UpdateCurrentLocations Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return { Message: "Failed to update location." };
  }
};

export default UpdateCurrentLocations;
