import axios from "axios";

const DeleteOrder = async (ID) => {
  try {
    const url = "https://api.hukmee.in/APIs/APIs.asmx/Deleteorder";

    const formData = new URLSearchParams();
    formData.append("token", "SWNCMPMSREMXAMCKALVAALI");
    formData.append("ID", ID);

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Response is expected like: { "message": "Inserted" }
    return response.data;
  } catch (error) {
    console.error("DeleteOrder API error:", error);
    throw error;
  }
};

export default DeleteOrder;
