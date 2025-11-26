import axios from "axios";

class GetWalletModel {
  constructor(id, WalletBalance, phone) {
    this.id = id;
    this.WalletBalance = WalletBalance;
    this.phone = phone;
  }

  static fromJson(json) {
    return new GetWalletModel(
      json.ID || 0,
      json.Balance || "0",
      json.Phone || ""
    );
  }
}

const GetWallet = async (phone) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("phone", phone);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowWalletVendors",
      formData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const rawData = response.data;

    // ✅ rawData is already an array
    if (Array.isArray(rawData)) {
      return rawData.map((item) => GetWalletModel.fromJson(item));
    } else {
      console.warn("Unexpected wallet response:", rawData);
      return [];
    }
  } catch (error) {
    console.log("API Error (GetWallet): ", error.message);
    return [];
  }
};

export default GetWallet;
