import React, { useState } from "react";
import InsertJoinCourse from "../../backend/joincourse/insertjoinpage";

const JoinCourses = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    education: "",
    address: "",
    coursename: "",
    courseprice: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const result = await InsertJoinCourse(
        formData.name,
        formData.email,
        formData.phone,
        formData.age,
        formData.education,
        formData.address,
        formData.coursename,
        formData.courseprice
      );

      console.log("API Response:", result);

      if (result?.message?.trim() === "Inserted") {
        alert("Sent successfully! 🎉");
        setFormData({
          name: "",
          email: "",
          phone: "",
          age: "",
          education: "",
          address: "",
          coursename: "",
          courseprice: "",
        });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 mt-[80px]">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-3">
          Join Our Courses
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Fill out the form below to start your learning journey.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <FloatingInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <FloatingInput
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Phone */}
          <FloatingInput
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {/* Age */}
          <FloatingInput
            label="Age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />

          {/* Education */}
          <FloatingInput
            label="Education"
            name="education"
            value={formData.education}
            onChange={handleChange}
          />

          {/* Address */}
          <FloatingTextarea
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          {/* Course Name */}
          <FloatingInput
            label="Course Name"
            name="coursename"
            value={formData.coursename}
            onChange={handleChange}
          />

          {/* Course Price */}
          <FloatingInput
            label="Course Price"
            type="number"
            name="courseprice"
            value={formData.courseprice}
            onChange={handleChange}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Join Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Floating input component
const FloatingInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required,
}) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      className="peer w-full border border-gray-200 rounded-lg p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
      required={required}
    />
    <label
      className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-1.5 transition-all duration-200 
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base
      peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
    >
      {label}
    </label>
  </div>
);

// Floating textarea component
const FloatingTextarea = ({ label, name, value, onChange }) => (
  <div className="relative">
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      rows="4"
      className="peer w-full border border-gray-200 rounded-lg p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 resize-none"
    />
    <label
      className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-1.5 transition-all duration-200 
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base
      peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
    >
      {label}
    </label>
  </div>
);

export default JoinCourses;
