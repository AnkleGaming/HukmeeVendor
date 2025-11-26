import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RegisterUser from "../../backend/authentication/register";
import Color from "../core/constant";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    aadhaarFront: "",
    aadhaarBack: "",
  });
  const [errors, setErrors] = useState({});
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const phone = localStorage.getItem("userPhone");
  const [aadhaarFrontBase64, setAadhaarFrontBase64] = useState("");
  const [aadhaarBackBase64, setAadhaarBackBase64] = useState("");

  // Focus trap for accessibility
  useEffect(() => {
    const formElement = formRef.current;
    if (!formElement) return;

    const focusableElements = formElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableElements.length) return;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    formElement.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();

    return () => formElement.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = () => {
        // reader.result is like "data:image/png;base64,AAA..."
        const base64String = (reader.result || "")
          .toString()
          .replace(/^data:image\/[a-zA-Z]+;base64,/, "");

        if (name === "aadhaarFront") {
          setPreviewFront(previewUrl);
          setAadhaarFrontBase64(base64String);
          // mark in formData (helps for UI/other checks)
          setFormData((prev) => ({
            ...prev,
            aadhaarFront: file.name || "selected",
          }));
        } else if (name === "aadhaarBack") {
          setPreviewBack(previewUrl);
          setAadhaarBackBase64(base64String);
          setFormData((prev) => ({
            ...prev,
            aadhaarBack: file.name || "selected",
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // remove handlers for user to clear selected file
  const removeAadhaarFront = () => {
    setPreviewFront(null);
    setAadhaarFrontBase64("");
    setFormData((prev) => ({ ...prev, aadhaarFront: "" }));
  };

  const removeAadhaarBack = () => {
    setPreviewBack(null);
    setAadhaarBackBase64("");
    setFormData((prev) => ({ ...prev, aadhaarBack: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (
      !formData.email.trim() ||
      !formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    )
      newErrors.email = "Valid email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    // Validate using base64 states which actually contain the image payload
    if (!aadhaarFrontBase64 || aadhaarFrontBase64.length < 10)
      newErrors.aadhaarFront = "Aadhaar front image is required";
    if (!aadhaarBackBase64 || aadhaarBackBase64.length < 10)
      newErrors.aadhaarBack = "Aadhaar back image is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // scroll to first error field optionally
      const firstKey = Object.keys(validationErrors)[0];
      const el = formRef.current?.querySelector(`[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    try {
      const result = await RegisterUser(
        formData.name,
        formData.email,
        phone,
        "",
        formData.address,
        aadhaarFrontBase64, // <-- Front Image Base64
        aadhaarBackBase64 // <-- Back Image Base64
      );

      console.log("Register API Response:", result);

      if (result) {
        alert("Registered successfully!");
        navigate("/");
        window.location.reload();
      } else {
        alert("Registration failed, please try again.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-sans flex items-center justify-center">
      <div
        className="relative w-full max-w-lg p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-200"
        ref={formRef}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2
          className="text-2xl sm:text-3xl font-bold mb-6"
          style={{ color: Color.primaryMain }}
        >
          Register
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              className="block text-sm font-medium"
              style={{ color: Color.primaryMain }}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium"
              style={{ color: Color.primaryMain }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              className="block text-sm font-medium"
              style={{ color: Color.primaryMain }}
            >
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="4"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* Aadhaar Front */}
          <div>
            <label
              className="block text-sm font-medium"
              style={{ color: Color.primaryMain }}
            >
              Aadhaar Front Image
            </label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="file"
                name="aadhaarFront"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
              {previewFront && (
                <button
                  type="button"
                  onClick={removeAadhaarFront}
                  className="text-sm px-2 py-1 rounded bg-red-100 text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            {previewFront && (
              <img
                src={previewFront}
                alt="Aadhaar Front"
                className="mt-2 h-32 w-auto rounded object-cover"
              />
            )}
            {errors.aadhaarFront && (
              <p className="mt-1 text-sm text-red-600">{errors.aadhaarFront}</p>
            )}
          </div>

          {/* Aadhaar Back */}
          <div>
            <label
              className="block text-sm font-medium"
              style={{ color: Color.primaryMain }}
            >
              Aadhaar Back Image
            </label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="file"
                name="aadhaarBack"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
              {previewBack && (
                <button
                  type="button"
                  onClick={removeAadhaarBack}
                  className="text-sm px-2 py-1 rounded bg-red-100 text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            {previewBack && (
              <img
                src={previewBack}
                alt="Aadhaar Back"
                className="mt-2 h-32 w-auto rounded object-cover"
              />
            )}
            {errors.aadhaarBack && (
              <p className="mt-1 text-sm text-red-600">{errors.aadhaarBack}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 bg-${Color.primaryMain} text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300`}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
