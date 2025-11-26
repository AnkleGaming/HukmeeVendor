import axios from "axios";

class GetReferDetailshModel {
  constructor(id, ReferCode, FriendCode, Phone) {
    this.id = id;
    this.ReferCode = ReferCode;
    this.FriendCode = FriendCode;
    this.Phone = Phone;
  }

  static fromJson(json) {
    return new GetReferDetailshModel(
      json.id || 0,
      json.ReferCode || "",
      json.FriendCode || "",
      json.Phone || ""
    );
  }
}

const GetReferDetailsh = async (phone) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("phone", phone);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/GetReferCode",
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

    return rawData.map((item) => GetReferDetailshModel.fromJson(item));
  } catch (error) {
    console.log("API Error (GetReferDetailsh): ", error.message);
    return [];
  }
};

export default GetReferDetailsh;
