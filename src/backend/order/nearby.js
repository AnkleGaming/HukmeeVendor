import axios from "axios";

const NearBy = async ({ ProductName = "", lat = "", lon = "" }) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("ProductName", ProductName);
  formData.append("lat", lat);
  formData.append("lon", lon);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/NearBy",
      formData.toString(), // convert form data to string
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Return response data (parsed JSON if available)
    return response.data;
  } catch (error) {
    console.error("NearBy API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
};

export default NearBy;
