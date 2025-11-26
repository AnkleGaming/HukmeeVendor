import axios from "axios";

const GetSubCategory = async () => {
  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ServiceCategory",
      new URLSearchParams({
        token: "SWNCMPMSREMXAMCKALVAALI",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export default GetSubCategory;
