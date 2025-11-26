import axios from "axios";

const CheckReferCode = async (refer, phone) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("refer", refer);
  formData.append("phone", phone);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/UpdateReferCode",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 200) {
      // Return actual API message instead of true/false
      return response.data?.message || "Unknown Error";
    } else {
      return "Request Failed";
    }
  } catch (error) {
    console.error("Error:", error);
    return "Network Error";
  }
};

export default CheckReferCode;
