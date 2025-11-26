import axios from "axios";

class GetWomenServiceModel {
  constructor(id, image, text, serviceId, description, type) {
    this.id = id;
    this.image = image;
    this.text = text;
    this.serviceId = serviceId;
    this.description = description;
    this.type = type;
  }

  static fromJson(json) {
    return new GetWomenServiceModel(
      json.id || 0,
      json.Image || "",
      json.Text || "",
      json.Serviceid || "",
      json.Description || "",
      json.Type || ""
    );
  }
}

const GetWomenServices = async () => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/GetWomenServices",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data;

    if (!data || !Array.isArray(data)) {
      console.error("Unexpected response format:", data);
      return [];
    }

    return data
      .map((item) => {
        if (item && typeof item === "object") {
          return GetWomenServiceModel.fromJson(item);
        }
        return null;
      })
      .filter(Boolean); // remove nulls
  } catch (error) {
    console.error("Error fetching GetWomenServices:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export default GetWomenServices;
