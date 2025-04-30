import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Dimensions 
} from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Animatable from "react-native-animatable";
import { login } from "../API/auth";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);//for eye

  const handleLogin = async () => {
    if(!email?.trim() || !password?.trim()){
      Alert.alert("Error", "Please fill your email and password!");
      return;
    }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
          Alert.alert("Error", "Please enter a valid email address!");
          return;
        }    
    try {
      const res = await login({ email, password });
      console.log("Login Success:", res);
      navigation.replace("home");
    } catch (error) {
      Alert.alert("Login Failed", "Please check your login credentials!");
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={800} style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputContainer}>
          <Icon name="email" size={wp("5%")} color="#15803D" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={wp("5%")} color="#15803D" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={secureText}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Icon name={secureText ? "eye-off" : "eye"} size={wp("5%")} color="#666" />
          </TouchableOpacity>
        </View>
        <Button mode="contained" style={styles.button} onPress={handleLogin}>
          <Text>
          Login
          </Text>
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.signupContainer}>
  <Text>
    <Text style={styles.signupText}>Don't have an account?</Text>
    <Text style={styles.signupLink}> Sign Up</Text>
  </Text>
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
    paddingVertical: hp("1.5%"), 
    paddingHorizontal: wp("2%"), 
    fontSize: wp("4%") 
  },
  button: { 
    marginTop: hp("2%"), 
    backgroundColor: "#15803D", 
    paddingVertical: hp("1.5%"), 
    borderRadius: wp("10%") 
  },
  signupContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginTop: hp("2%") 
  },
  signupText: { 
    fontSize: wp("4%"), 
    color: "#666" 
  },
  signupLink: { 
    fontSize: wp("4%"), 
    color: "black", 
    fontWeight: "bold" 
  },
});

export default LoginScreen;
