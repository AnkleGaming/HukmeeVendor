import axios from "axios";

class GetInTouchModel {
  constructor(ID, Phone, Email, Address, Link1, Link2, Link3) {
    this.ID = ID;
    this.Phone = Phone;
    this.Email = Email;
    this.Address = Address;
    this.Link1 = Link1;
    this.Link2 = Link2;
    this.Link3 = Link3;
  }

  static fromJson(json) {
    return new GetInTouchModel(
      json.ID || 0,
      json.Phone || "",
      json.Email || "",
      json.Address || "",
      json.Link1 || "",
      json.Link2 || "",
      json.Link3 || ""
    );
  }
}

const GetInTouch = async () => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowGetinTouch",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let rawData = response.data;

    // Sometimes ASMX wraps JSON as string
    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch {
        console.error("Could not parse response as JSON", rawData);
        return [];
      }
    }

    // Ensure it’s an array
    if (!Array.isArray(rawData)) {
      console.warn("Expected array but got:", rawData);
      return [];
    }

    return rawData.map((item) => GetInTouchModel.fromJson(item));
  } catch (error) {
    console.error("API Error (GetInTouch):", error);
    return [];
  }
};

export default GetInTouch;
