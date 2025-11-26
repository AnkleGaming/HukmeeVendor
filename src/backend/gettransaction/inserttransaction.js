import axios from "axios";

const InsertTransaction = async (transactionId, amount, date, phone) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("TransactionID", transactionId);
  formData.append("Amount", amount);
  formData.append("Dates", date);
  formData.append("Phone", phone);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/InsertTransactionsVendor",
      formData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // ✅ Check if response is successful and has message
    if (response.status === 200) {
      const rawData = response.data;
      const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;

      // ✅ Return true only if both conditions match
      return data.Message === "Inserted Successfully!";
    }

    // Non-200 status = fail
    return false;
  } catch (error) {
    console.log("API Error (InsertTransaction):", error.message);
    return false;
  }
};

export default InsertTransaction;
