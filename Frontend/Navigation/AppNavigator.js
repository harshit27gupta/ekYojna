import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../Context/AppContext";
import AuthNavigator from "../Navigation/AuthNavigator";
import MainNavigator from "./MainNavigator";
import SplashScreen from "../SplashScreen";

const AppNavigator = () => {
  const { userToken, isLoading } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isLoading ? null : userToken ? <MainNavigator /> : <AuthNavigator />}
      {isLoading && !userToken && <SplashScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
