import axios from "axios";

const API = "http://localhost:5000/api/v1/auth";
import api from "@/lib/axios";


export const registerUser = async (data: any) => {
  const res = await axios.post(`${API}/register`, data, {
    withCredentials: true,
  });

  return res.data;
};

export const loginUser = async (data: any) => {
  const res = await axios.post(`${API}/login`, data, {
    withCredentials: true,
  });

  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post(`${API}/logout`, {}, {
    withCredentials: true,
  });

  return res.data;
};