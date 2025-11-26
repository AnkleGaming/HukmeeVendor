import axios from "axios";

class GetUserModel {
  constructor(
    id,
    fullname,
    email,
    phoneNumber,
    dob,
    verified,
    Address,
    VenImg,
    aadharFront,
    aadharBack
  ) {
    this.id = id;
    this.fullname = fullname;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.dob = dob;
    this.verified = verified;
    this.Address = Address;
    this.VenImg = VenImg;
    this.aadharFront = aadharFront;
    this.aadharBack = aadharBack;
  }

  static fromJson(json) {
    return new GetUserModel(
      json.ID || 0,
      json.FullName || "",
      json.Email || "",
      json.Phone || "",
      json.Dob || "",
      json.Verified || "",
      json.Address || "",
      json.VenImg || "",
      json.aadharFront || "",
      json.aadharBack || ""
    );
  }
}

const GetUser = async (phone) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("phone", phone);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowVendorProfile",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let rawData = response.data;

    // If response is a string, try to parse
    if (typeof rawData === "string") {
      try {
        rawData = JSON.parse(rawData);
      } catch {
        console.error("Could not parse response as JSON", rawData);
        return [];
      }
    }

    // Ensure it's an array before mapping
    if (!Array.isArray(rawData)) {
      console.warn("Expected array but got:", rawData);
      return [];
    }

    return rawData.map((item) => GetUserModel.fromJson(item));
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};

export default GetUser;
