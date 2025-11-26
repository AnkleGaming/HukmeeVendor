import axios from "axios";

class GetAddressModel {
  constructor(id, Name, Phone, Address, City, PinCode, Userph) {
    this.id = id;
    this.Name = Name;
    this.Phone = Phone;
    this.Address = Address;
    this.City = City;
    this.PinCode = PinCode;
    this.Userph = Userph;
  }

  static fromJson(json) {
    return new GetAddressModel(
      json.id || 0,
      json.Name || "",
      json.Phone || "",
      json.Address || "",
      json.City || "",
      json.PinCode || "",
      json.Userph || ""
    );
  }
}

const GetAddress = async (Phone) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("Phone", Phone || "");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowAddresss",
      formData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    let rawData = response.data;

    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch (error) {
        console.error("Failed to parse response as JSON:", rawData, error);
        return [];
      }
    }

    // Handle non-array responses
    if (!Array.isArray(rawData)) {
      if (rawData?.message) {
        console.warn("API returned message instead of array:", rawData.message);
        return [];
      }
      console.warn("Expected array but got:", rawData);
      return [];
    }

    return rawData.map((item) => GetAddressModel.fromJson(item));
  } catch (error) {
    console.error("Error fetching addresses:", error.message, {
      status: error.response?.status,
      data: error.response?.data,
      request: {
        url: error.config?.url,
        data: error.config?.data,
      },
    });
    return [];
  }
};

export default GetAddress;
