import axios from "axios";

class SpecialforyouModel {
  constructor(
    id,
    PackageTime,
    PackageImage,
    PackageName,
    PackageCutPrice,
    PackPrice,
    PackageDescription
  ) {
    this.id = id;
    this.PackageTime = PackageTime;
    this.PackageImage = PackageImage;
    this.PackageName = PackageName;
    this.PackageCutPrice = PackageCutPrice;
    this.PackPrice = PackPrice;
    this.PackageDescription = PackageDescription;
  }

  static fromJson(json) {
    return new SpecialforyouModel(
      json.id || 0,
      json.PackageTime || "",
      json.PackageImage || "",
      json.PackageName || "",
      json.PackageCutPrice || 0,
      json.PackPrice || 0,
      json.PackageDescription || "" // ✅ Fixed spelling
    );
  }
}

const GetSpecialforyou = async () => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/SpeciallyForYou",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let rawData = response.data;

    // Some APIs return JSON as a string
    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch (err) {
        console.error("Error parsing SpecialForYou API response:", err);
        return [];
      }
    }

    // Convert to model list
    return rawData.map((item) => SpecialforyouModel.fromJson(item));
  } catch (error) {
    console.error("SpecialForYou API Error:", error);
    return [];
  }
};

export default GetSpecialforyou;
