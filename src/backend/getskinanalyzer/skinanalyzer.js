import axios from "axios";

class SkinAnalyzerModel {
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
    return new SkinAnalyzerModel(
      json.id || 0,
      json.Tabid || "",
      json.ServiceName || "",
      json.duration || "",
      json.Fees || "",
      json.DiscountFees || "",
      json.Image || ""
    );
  }
}

const GetSkinAnalyzer = async () => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowSkinlyzer",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let rawData = response.data;
    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch (err) {
        console.error("Invalid JSON format in ShowSkinlyzer response", err);
        return [];
      }
    }

    if (!Array.isArray(rawData)) {
      console.error("Unexpected response format:", rawData);
      return [];
    }

    return rawData.map((item) => SkinAnalyzerModel.fromJson(item));
  } catch (error) {
    console.error("Error fetching ShowSkinlyzer:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export default GetSkinAnalyzer;
