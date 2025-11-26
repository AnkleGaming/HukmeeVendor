import axios from "axios";

class GetMenServiceModel {
  constructor(id, image, text, serviceId, description, type) {
    this.id = id;
    this.image = image;
    this.text = text;
    this.serviceId = serviceId;
    this.description = description;
    this.type = type;
  }

  static fromJson(json) {
    return new GetMenServiceModel(
      json.id || 0,
      json.Image || json.image || "",
      json.Text || json.text || "",
      json.Serviceid || json.serviceId || "",
      json.Description || json.description || "",
      json.Type || json.type || ""
    );
  }
}

const GetMenServices = async () => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/GetMenServices",
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
        console.error("Invalid JSON format in GetMenServices response");
        return [];
      }
    }

    if (!Array.isArray(rawData)) {
      console.error("Unexpected response format:", rawData);
      return [];
    }

    return rawData.map((item) => GetMenServiceModel.fromJson(item));
  } catch (error) {
    console.error("Error fetching GetMenServices:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export default GetMenServices;
