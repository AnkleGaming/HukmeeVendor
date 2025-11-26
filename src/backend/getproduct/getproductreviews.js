import axios from "axios";

class GetProductReviewModel {
  constructor(ID, ProductID, Review, Rating, Name, image, Phone) {
    this.ID = ID;
    this.ProductID = ProductID;
    this.Review = Review;
    this.Rating = Rating;
    this.Name = Name;
    this.image = image; // use lowercase consistently
    this.Phone = Phone;
  }

  static fromJson(json) {
    // Normalize image URL
    let imageUrl = "";
    if (json.iMAGE) {
      imageUrl = json.iMAGE.startsWith("http")
        ? json.iMAGE
        : `https://weprettify.com/Images/${json.iMAGE}`;
    }

    return new GetProductReviewModel(
      json.ID || 0,
      json.ProductID || 0,
      json.Review || "",
      parseFloat(json.Rating) || 0,
      json.Name || "",
      imageUrl,
      json.Phone || ""
    );
  }
}

const GetProductReviews = async (productId) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("ProID", productId);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowProductReviews",
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
        console.error(
          "Invalid JSON format in ShowProductReviews response",
          err
        );
        return [];
      }
    }

    if (!Array.isArray(rawData)) {
      console.error("Unexpected response format:", rawData);
      return [];
    }

    // Map and normalize each review
    return rawData.map((item) => GetProductReviewModel.fromJson(item));
  } catch (error) {
    console.error("Error fetching GetProductReviews:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export default GetProductReviews;
