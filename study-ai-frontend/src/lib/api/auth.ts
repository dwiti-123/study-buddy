import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth` || "http://localhost:3000/api/auth";
axios.defaults.withCredentials = true;

// ---------------- Login ----------------
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data; // backend should return tokens or user info
  } catch (error: any) {
    return error.response?.data || { success: false, message: "Login failed" };
  }
};

// ---------------- Register ----------------
export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, message: "Registration failed" };
  }
};

// ---------------- Forgot Password ----------------
export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
    return response.data; // success message from backend
  } catch (error: any) {
    return error.response?.data || { success: false, message: "Forgot password request failed" };
  }
};

// ---------------- Reset Password ----------------
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, { token, newPassword });
    return response.data; // success message from backend
  } catch (error: any) {
    return error.response?.data || { success: false, message: "Reset password failed" };
  }
};

// ---------------- Logout ----------------
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/logout`);
    return response.data; // backend success message
  } catch (error: any) {
    return error.response?.data || { success: false, message: "Logout failed" };
  }
};
