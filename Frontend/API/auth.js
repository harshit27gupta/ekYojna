import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.158.130:4000/auth"; 

export const signup = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/signup`, userData);
    await AsyncStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const savePersonalDetails = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/save-details`, userData);
    return res.data;
  } catch (error) {
    console.error("Error saving details:", error);
    throw error.response ? error.response.data : error;
  }
};

export const login = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userData);
    await AsyncStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
export const updateProfile = async (updatedData) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const res = await axios.put(`${API_URL}/update-profile`, updatedData, {
      headers: { "x-auth-token": token },
    });
    return res.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getProfile = async () => {
  const token = await AsyncStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/profile`, {
      headers: { "x-auth-token": token },
    });
    return res.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
