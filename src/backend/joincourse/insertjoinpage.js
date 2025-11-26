import axios from "axios";

const InsertJoinCourse = async (
  Name,
  Email,
  Phone,
  Age,
  Education,
  Address,
  CourseName,
  CoursePrice
) => {
  const formData = new URLSearchParams();
  formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
  formData.append("Name", Name);
  formData.append("Email", Email);
  formData.append("Phone", Phone);
  formData.append("Age", Age);
  formData.append("Education", Education);
  formData.append("Address", Address);
  formData.append("CourseName", CourseName);
  formData.append("CoursePrice", CoursePrice);

  try {
    const response = await axios.post(
      "https://api.hukmee.in/APIs/APIs.asmx/Insertjoinpage",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
export default InsertJoinCourse;
