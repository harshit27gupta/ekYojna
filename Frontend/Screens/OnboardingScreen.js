import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Platform
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { savePersonalDetails } from "../API/auth";

const OnboardingScreen = ({ route }) => {
  const navigation = useNavigation();
  const buttonRef = useRef(null);
  const formData = route.params?.formData || {};

  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [educationLevel, setEducationLevel] = useState(null);
  const [employmentType, setEmploymentType] = useState(null);

  const [openGender, setOpenGender] = useState(false);
  const [openMaritalStatus, setOpenMaritalStatus] = useState(false);
  const [openEducationLevel, setOpenEducationLevel] = useState(false);
  const [openEmploymentType, setOpenEmploymentType] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!phone ||!occupation ||!gender) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if(phone.length < 10 || phone.length>10){
      Alert.alert("Error", "Phone number should be  10 digits");
      return;
    }

    if (buttonRef.current) {
      buttonRef.current.stopAnimation();
    }
    setLoading(true);
    try {
      await savePersonalDetails({
        email: formData.email,
        gender,
        maritalStatus,
        occupation,
        employmentStatus: employmentType,
        education: educationLevel,
        address,
        phone,
      });
      Toast.show({
        type: "success",
        text1: "Successful!",
        text2: "Your profile has been updated!",
      });
      navigation.navigate("home");
    } catch (error) {
      console.error("Error saving details:", error);
      Alert.alert("Error", error.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => item;

  const formFields = [
    <Text key="title" style={styles.title}>Let's Get to Know More About You!</Text>,
    <View key="phone" style={styles.inputContainer}>
      <Icon name="phone" size={24} color="#15803D" />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholderTextColor="#999"
      />
    </View>,
    <View key="gender" style={{ zIndex: 4000 }}>
      <DropDownPicker
        open={openGender}
        setOpen={setOpenGender}
        value={gender}
        setValue={setGender}
        items={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" },
        ]}
        placeholder="Select Gender"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
    </View>,
    <View key="marital" style={{ zIndex: 3000 }}>
      <DropDownPicker
        open={openMaritalStatus}
        setOpen={setOpenMaritalStatus}
        value={maritalStatus}
        setValue={setMaritalStatus}
        items={[
          { label: "Single", value: "single" },
          { label: "Married", value: "married" },
        ]}
        placeholder="Marital Status"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
    </View>,
    <View key="occupation" style={styles.inputContainer}>
      <Icon name="briefcase" size={24} color="#15803D" />
      <TextInput
        style={styles.input}
        placeholder="Occupation"
        value={occupation}
        onChangeText={setOccupation}
        placeholderTextColor="#999"
      />
    </View>,
    <View key="education" style={{ zIndex: 2000 }}>
      <DropDownPicker
        open={openEducationLevel}
        setOpen={setOpenEducationLevel}
        value={educationLevel}
        setValue={setEducationLevel}
        items={[
          { label: "High School", value: "high_school" },
          { label: "Associate Degree", value: "associate" },
          { label: "Bachelor's Degree", value: "bachelor" },
          { label: "Master's Degree", value: "master" },
          { label: "Doctorate", value: "doctorate" },
        ]}
        placeholder="Education Level"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
    </View>,
    <View key="employment" style={{ zIndex: 1500 }}>
      <DropDownPicker
        open={openEmploymentType}
        setOpen={setOpenEmploymentType}
        value={employmentType}
        setValue={setEmploymentType}
        items={[
          { label: "Full-time", value: "full_time" },
          { label: "Part-time", value: "part_time" },
          { label: "Self-employed", value: "self_employed" },
          { label: "Unemployed", value: "unemployed" },
        ]}
        placeholder="Employment Type"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
    </View>,
    <View key="address" style={styles.inputContainer}>
      <Icon name="home" size={24} color="#15803D" />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        placeholderTextColor="#999"
      />
    </View>,
    <Animatable.View key="button" ref={buttonRef} animation="pulse" iterationCount="infinite">
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.buttonText}>Save</Text>}
      </TouchableOpacity>
    </Animatable.View>
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={formFields}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.card}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(240, 242, 245, 1)",
  },
  card: {
    paddingBottom: 60,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#15803D",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(240,240,240,0.9)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(98,0,238,0.2)",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  dropdown: {
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(98,0,238,0.6)",
  },
  dropdownContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(98,0,238,0.6)",
  },
  button: {
    backgroundColor: "#15803D",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
