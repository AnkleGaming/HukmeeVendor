import axios from "axios";

class GetServicesTabModel {
  constructor(id, Tabname, SubCatid) {
    this.id = id;
    this.Tabname = Tabname;
    this.SubCatid = SubCatid;
  }

  static fromJson(json) {
    return new GetServicesTabModel(
      json.id || 0,
      json.Tabname || "",
      json.SubCatid || 0
    );
  }
}

const GetServicesTab = async (Id) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("id", Id);
  formData.append("type", "1");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/GetTabs",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let rawData = response.data;

    // Handle if response is JSON string
    if (typeof rawData === "string") {
      rawData = JSON.parse(rawData);
    }

    // Map JSON to model instances
    const serviceTab = rawData.map((item) =>
      GetServicesTabModel.fromJson(item)
    );

    return serviceTab;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export default GetServicesTab;
