import axios from "axios";

class GetProductImageModel {
  constructor(prdImgId, productId, productImage) {
    this.prdImgId = prdImgId;
    this.productId = productId;
    this.productImage = productImage;
  }

  static fromJson(json) {
    return new GetProductImageModel(
      json.PrdImgID || "",
      json.ProductID || "",
      json.pRODUCTiMAGES || "" // ✅ map correctly
    );
  }
}

const GetProductImage = async (productId) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("ProID", productId); // ✅ Correct param (NOT PrdImgID)

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowProductImages",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data) {
      if (Array.isArray(response.data)) {
        return response.data.map((item) => GetProductImageModel.fromJson(item));
      }
      return [GetProductImageModel.fromJson(response.data)];
    }

    return [];
  } catch (err) {
    console.error("Error fetching product image:", err);
    return [];
  }
};

export default GetProductImage;
