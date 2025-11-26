import axios from "axios";

const UpdateVendor = async (Fullname, Email, Phone, Dob, Address, VenImg) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("FullName", Fullname || "");
  formData.append("Email", Email || "");
  formData.append("Phone", Phone || "");
  formData.append("Dob", Dob || "");
  formData.append("Verified", "");
  formData.append("Address", Address || "");
  formData.append("VenImg", VenImg || "");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/UpdateVendorProfile",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update Error:", error);
  }
};
export default UpdateVendor;
