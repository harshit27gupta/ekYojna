import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Animatable from "react-native-animatable";
import Toast from "react-native-toast-message";
import { signup } from "../API/auth";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const validateAndProceed = async () => {
    if ( !formData.name?.trim() ||!formData.age ||  !formData.email?.trim() ||  !formData.password ||  !formData.confirmPassword ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    if (formData.password.length < 4) {
      Alert.alert("Error", "Password must be at least 4 characters long!");
      return;
    }
    if(formData.age <1 || formData.age > 100){
      Alert.alert("Error", "Please enter correct age");
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address!");
      return;
    }    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    setTimeout(async () => {
      try {
        const response = await signup({
          name: formData.name,
          age: Number(formData.age),
          email: formData.email,
          password: formData.password,
        });

        Toast.show({
          type: "success",
          text1: "Registration Successful!",
          text2: "You have been registered successfully 🎉",
        });

        navigation.navigate("onboard",{formData});
        setFormData({ name: "", age: "", email: "", password: "", confirmPassword: "" });
      } catch (error) {
        console.error("Signup error:", error);
        Alert.alert("Error", error.msg || "Something went wrong");
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={800} style={styles.formContainer}>
        <Text style={styles.title}>Welcome to eKyojna</Text>
        <View style={styles.inputContainer}>
          <Icon name="account" size={wp("5%")} color="#15803D" />
          <TextInput
            label="Full Name"
            mode="flat"
            style={styles.input}
            value={formData.name}
            onChangeText={(val) => setFormData({ ...formData, name: val })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="calendar" size={wp("5%")} color="#15803D" />
          <TextInput
            label="Age"
            mode="flat"
            keyboardType="numeric"
            style={styles.input}
            value={formData.age}
            onChangeText={(val) => setFormData({ ...formData, age: val })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="email" size={wp("5%")} color="#15803D" />
          <TextInput
            label="Email"
            mode="flat"
            keyboardType="email-address"
            style={styles.input}
            value={formData.email}
            onChangeText={(val) => setFormData({ ...formData, email: val })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={wp("5%")} color="#15803D" />
          <TextInput
            label="Password"
            mode="flat"
            secureTextEntry={securePassword}
            style={styles.input}
            value={formData.password}
            onChangeText={(val) => setFormData({ ...formData, password: val })}
          />
          <TouchableOpacity onPress={() => setSecurePassword(!securePassword)}>
            <Icon name={securePassword ? "eye-off" : "eye"} size={wp("5%")} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock-check" size={wp("5%")} color="#15803D" />
          <TextInput
            label="Confirm Password"
            mode="flat"
            secureTextEntry={secureConfirmPassword}
            style={styles.input}
            value={formData.confirmPassword}
            onChangeText={(val) => setFormData({ ...formData, confirmPassword: val })}
          />
          <TouchableOpacity onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}>
            <Icon name={secureConfirmPassword ? "eye-off" : "eye"} size={wp("5%")} color="#666" />
          </TouchableOpacity>
        </View>
        <Button mode="contained" style={styles.button} onPress={validateAndProceed}>
          Sign Up
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    paddingHorizontal: wp("5%"), 
    backgroundColor: "rgba(0,0,0,0.05)" 
  },
  formContainer: { 
    width: wp("90%"), 
    padding: wp("5%"), 
    backgroundColor: "rgba(255, 255, 255, 0.95)", 
    borderRadius: wp("4%"), 
    elevation: 10 
  },
  title: { 
    fontSize: wp("7%"), 
    fontWeight: "bold", 
    textAlign: "center", 
    color: "#15803D", 
    marginBottom: hp("2%") 
  },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "rgba(240,240,240,0.9)", 
    borderRadius: wp("3%"), 
    paddingHorizontal: wp("3%"), 
    marginBottom: hp("1.5%") 
  },
  input: { 
    flex: 1, 
    backgroundColor: "transparent", 
    fontSize: wp("4%") 
  },
  button: { 
    marginTop: hp("2%"), 
    backgroundColor: "#15803D", 
    paddingVertical: hp("1.5%"), 
    borderRadius: wp("3%") 
  },
  loginContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginTop: hp("2%") 
  },
  loginText: { 
    fontSize: wp("4%"), 
    color: "#666" 
  },
  loginLink: {
    fontSize: wp("4%"),
    color: "blue",
    fontWeight: "bold",
    textDecorationLine: "underline"
  }
  
});

export default SignupScreen;
