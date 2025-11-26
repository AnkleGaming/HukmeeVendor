import axios from "axios";

class GetSubCategoryModel {
  constructor(id, image, text, serviceId, description, type) {
    this.id = id;
    this.image = image;
    this.text = text;
    this.serviceId = serviceId;
    this.description = description;
    this.type = type;
  }

  static fromJson(json) {
    return new GetSubCategoryModel(
      json.id || 0,
      json.Image || json.image || "",
      json.Text || json.text || "",
      json.Serviceid || json.serviceId || "",
      json.Description || json.description || "",
      json.Type || json.type || ""
    );
  }
}

const GetSubCategory = async (Id, Type) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("id", Id);
  formData.append("type", Type);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/OffersService",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let rawData = response.data;

    // If response is a string, try parsing JSON
    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch {
        console.error("Invalid JSON format in OffersService response");
        return [];
      }
    }

    if (!Array.isArray(rawData)) {
      console.error("Unexpected response format:", rawData);
      return [];
    }

    return rawData.map((item) => GetSubCategoryModel.fromJson(item));
  } catch (error) {
    console.error("Error fetching GetSubCategory:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export default GetSubCategory;
