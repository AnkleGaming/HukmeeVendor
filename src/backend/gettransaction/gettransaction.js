import axios from "axios";

class GetTransactionModel {
  constructor(id, Transactionid, TransactionAmt, DateTime, Phone) {
    this.id = id;
    this.Transactionid = Transactionid;
    this.TransactionAmt = TransactionAmt;
    this.DateTime = DateTime;
    this.Phone = Phone;
  }
  static fromJson(json) {
    return new GetTransactionModel(
      json.ID || 0,
      json.TransactionID || "",
      json.Amount || "",
      json.Dates || "",
      json.Phone || ""
    );
  }
}

const GetTransaction = async (phone) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("phone", phone);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowTransactionVendor",
      formData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const rawData = response.data;

    if (Array.isArray(rawData)) {
      return rawData.map((item) => GetTransactionModel.fromJson(item));
    } else {
      console.warn("Unexpected wallet response:", rawData);
      return [];
    }
  } catch (error) {
    console.log("API Error (GetWallet): ", error.message);
    return [];
  }
};
export default GetTransaction;
