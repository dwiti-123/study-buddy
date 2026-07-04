import axios from "axios";

const API_BASE_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api/resources` || "http://localhost:3000/api/resources";

// Always include cookies for auth
axios.defaults.withCredentials = true;

export const generateStudyResource = async (
  data:
    | { type: "youtube"; source: string }
    | { type: "text" | "notes"; originalContent: string }
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    //  Handle backend error responses gracefully
    const message =
      error.response?.data?.message ||
      error.response?.statusText ||
      "Failed to generate study resource";

    // Option 1: throw custom error (your UI handles it)
    throw new Error(message);

    // Option 2 (optional): return a normalized object
    // return { success: false, message };
  }
};

export const getAllResources = async (params?: { search?: string; page?: number; limit?: number }) => {
  try {
    const res = await axios.get(API_BASE_URL, {
      withCredentials: true,
      params, 
    });
    return res.data;
  } catch (error: any) {
    console.error("Error fetching resources:", error);
    return error.response?.data || { success: false, message: "Failed to fetch resources" };
  }
};

export const getResourceById = async (id: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/${id}`, { withCredentials: true });
    return res.data;
  } catch (error: any) {
    console.error("Error fetching resource:", error);
    return error.response?.data || { success: false, message: "Failed to fetch resource" };
  }
};

