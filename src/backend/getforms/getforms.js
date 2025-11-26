import axios from "axios";

class GetFormsModel {
  constructor(id, formHeading, formDescription) {
    this.id = id;
    this.formHeading = formHeading;
    this.formDescription = formDescription;
  }

  static fromJson(json) {
    return new GetFormsModel(
      json.id || "",
      json.FormHeading || "",
      json.FormDescription || ""
    );
  }
}

const GetForms = async (formtype) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("FormHeading", formtype);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/GetForms",
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

    return rawData.map((item) => GetFormsModel.fromJson(item));
  } catch (error) {
    console.error("API Error (GetInTouch):", error);
    return [];
  }
};

export default GetForms;
