// backend/authentication/register.js
import axios from "axios";

const RegisterUser = async (
  Fullname,
  Email,
  Phone,
  Dob,
  Address,
  AdharFront,
  AdharBack
) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("FullName", Fullname || "");
  formData.append("Email", Email || "");
  formData.append("Phone", Phone || "");
  formData.append("Dob", Dob || "");
  formData.append("Verified", "");
  formData.append("VenImg", "");
  formData.append("Address", Address);
  formData.append("aadharFront", AdharFront || "");
  formData.append("aadharBack", AdharBack || "");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/RegisterVendors",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Register Error:", error);
    return null;
  }
};

export default RegisterUser;
