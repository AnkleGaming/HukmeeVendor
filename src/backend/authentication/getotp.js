import axios from "axios";

const SendSMS = async (phone, otp) => {
  const formData = new URLSearchParams();
  formData.append("phone", phone);
  formData.append("otp", otp);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/SendSMS",
      formData,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (response.status === 200) {
      return { success: true, statusCode: 200 };
    } else {
      return { success: false, statusCode: response.status };
    }
    console.log("📩 SMS API Response:", parsedData);
  } catch (error) {
    console.error("❌ Error sending OTP:", error);

    // Handle error case — include HTTP code if available
    return {
      success: false,
      statusCode: error.response?.status || 500,
      error: error.message,
    };
  }
};

export default SendSMS;
