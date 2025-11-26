import axios from "axios";

class GetSuggestProductModel {
  constructor(ProID, ProductName, ProductDes, Price) {
    this.ProID = ProID;
    this.ProductName = ProductName;
    this.ProductDes = ProductDes;
    this.Price = Price;
  }

  static fromJson(json) {
    return new GetSuggestProductModel(
      json.ProID || 0,
      json.ProductName || "",
      json.ProductDes || "",
      Number(json.Price) || 0
    );
  }
}

const GetSuggestProduct = async () => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowSuggestedProducts",
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
      } catch (err) {
        console.error("Invalid JSON format in ShowProducts response", err);
        return [];
      }
    }

    if (!Array.isArray(rawData)) {
      console.error("Unexpected response format:", rawData);
      return [];
    }

    return rawData.map((item) => GetSuggestProductModel.fromJson(item));
  } catch (error) {
    console.error("Error fetching GetProduct:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export default GetSuggestProduct;
