import axios from "axios";

class GetServicePackModel {
  constructor(id, tabid, servicename, duration, fees, discountfee, image) {
    this.id = id;
    this.tabid = tabid;
    this.servicename = servicename;
    this.duration = duration;
    this.fees = fees;
    this.discountfee = discountfee;
    this.image = image;
  }

  static fromJson(json) {
    return new GetServicePackModel(
      json.id || 0,
      parseInt(json.Tabid) || 0,
      json.ServiceName || "",
      json.duration || "",
      parseFloat(json.Fees) || 0,
      parseFloat(json.DiscountFees) || 0,
      json.Image || ""
    );
  }
}

const GetServicePack = async (id) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("id", id); // You can replace with dynamic value if needed
  formData.append("type", "1");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/GetServicePack",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let rawData = response.data;
    if (typeof rawData === "string") {
      rawData = JSON.parse(rawData);
    }

    return rawData.map((item) => GetServicePackModel.fromJson(item));
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export default GetServicePack;
