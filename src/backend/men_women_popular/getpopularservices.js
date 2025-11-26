import axios from "axios";

class GetPopularServicesModel {
  constructor(id, Tabid, ServiceName, duration, Fees, DiscountFees, Image) {
    this.id = id;
    this.Tabid = Tabid;
    this.ServiceName = ServiceName;
    this.duration = duration;
    this.Fees = Fees;
    this.DiscountFees = DiscountFees;
    this.Image = Image;
  }
  static fromJson(json) {
    return new GetPopularServicesModel(
      json.id || 0,
      json.Tabid || "",
      json.ServiceName || "",
      json.duration || "",
      json.Fees || 0,
      json.DiscountFees || 0,
      json.Image || ""
    );
  }
}

const GetPopularServices = async () => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/GetPopularServices",
      formData,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );

    let rawData = response.data;
    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch (err) {
        console.error("Error parsing SpecialForYou API response:", err);
        return [];
      }
    }

    if (Array.isArray(rawData)) {
      return rawData.map((item) => GetPopularServicesModel.fromJson(item));
    } else {
      console.error("API response is not an array:", rawData);
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};
export default GetPopularServices;
