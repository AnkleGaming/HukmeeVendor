import axios from "axios";

// Model class to represent a Course
class GetCourseModel {
  constructor(id, ServiceName, duration, Fees, DiscountFees, Image, Type) {
    this.id = id;
    this.ServiceName = ServiceName;
    this.duration = duration;
    this.Fees = Fees;
    this.DiscountFees = DiscountFees;
    this.Image = Image;
    this.Type = Type;
  }

  // Factory method to create an instance from raw JSON
  static fromJson(json) {
    return new GetCourseModel(
      json.id,
      json.ServiceName,
      json.duration,
      json.Fees,
      json.DiscountFees,
      json.Image,
      json.Type
    );
  }
}

// API call function
const GetCourse = async () => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/ShowCourse",
      formData
    );

    // Check if the response data is an array
    if (Array.isArray(response.data)) {
      // Convert each item in the array into a GetCourseModel instance
      const courses = response.data.map((item) =>
        GetCourseModel.fromJson(item)
      );
      return courses;
    } else {
      console.error("Unexpected response format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Get Course Error:", error);
    return [];
  }
};

export default GetCourse;
export { GetCourseModel };
