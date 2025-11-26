import axios from "axios";

const UpdateWallet = async (phone, balance, operation) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("Phone", phone);
  formData.append("Balance", balance);
  formData.append("Operation", operation);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/UpdateWalletVendors",
      formData,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    // Check if request succeeded
    if (response.status === 200) {
      const textResponse = response.data;

      // Try to extract JSON from the XML-like response
      const match = textResponse.match(/\{.*\}/);
      if (match) {
        const jsonResponse = JSON.parse(match[0]);
        // Return true only if message says "Updated Successfully!"
        return jsonResponse.Message === "Updated Successfully!";
      }
    }

    // Return false if status code isn't 200 or message isn't as expected
    return false;
  } catch (error) {
    console.error("Error updating wallet:", error);
    return false;
  }
};

export default UpdateWallet;
