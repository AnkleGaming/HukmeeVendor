import axios from "axios";

const InsertAddress = async (Name, Phone, Address, City, Pincode) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("Name", Name);
  formData.append("Phone", Phone);
  formData.append("Address", Address);
  formData.append("City", City);
  formData.append("Pincode", Pincode);
  formData.append("Userph", "");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/InsertAddresss",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
export default InsertAddress;
