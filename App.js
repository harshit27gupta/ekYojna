import React from "react";
import { StatusBar } from "react-native";
import AppNavigator from "./Frontend/Navigation/AppNavigator";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./Frontend/Context/AppContext";

const App = () => {
  return (
    <AuthProvider>
      <>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
        <Toast />
      </>
    </AuthProvider>
  );
};

export default App;
