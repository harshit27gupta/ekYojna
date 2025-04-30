// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("token");
    setUserToken(token);
    setTimeout(() => setIsLoading(false), 2000); 
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setIsLoading(true);
    setUserToken(null);
    checkLogin();
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
