import axios from "axios";

const WePretiffyVendor = async (Name, Mobile, Message, Type) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("name", Name);
  formData.append("mobile", Mobile);
  formData.append("msg", Message);
  formData.append("type", Type);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/Want",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // API doesn't return data, so just check if it's successful
    if (response.status === 200) {
      console.log("WePretiffyVendor: Data inserted successfully");
      return { success: true };
    } else {
      console.error(
        "WePretiffyVendor: API returned error status",
        response.status
      );
      return { success: false };
    }
  } catch (error) {
    console.error("WePretiffyVendor Error:", error);
    return { success: false };
  }
};

export default WePretiffyVendor;
