import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../Screens/LoginScreen";
import SignupScreen from "../Screens/SignupScreen";
import HomeScreen from "../Screens/HomeScreen";
import OnboardingScreen from "../Screens/OnboardingScreen"
import ProfileScreen from  "../Screens/ProfileScreen"
const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator  initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="onboard" component={OnboardingScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen}/>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
