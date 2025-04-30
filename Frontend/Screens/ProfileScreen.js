import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  Animated,
  TextInput,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getProfile, updateProfile } from "../API/auth";
import { AuthContext } from "../Context/AppContext";
import DropDownPicker from "react-native-dropdown-picker";

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const scaleAnim = new Animated.Value(1);
  const navigation = useNavigation();

  const [genderOpen, setGenderOpen] = useState(false);
  const [maritalOpen, setMaritalOpen] = useState(false);
  const [employmentOpen, setEmploymentOpen] = useState(false);

  const [genderOptions] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]);

  const [maritalOptions] = useState([
    { label: "Single", value: "single" },
    { label: "Married", value: "married" },
  ]);

  const [employmentOptions] = useState([
    { label: "Employed", value: "employed" },
    { label: "Unemployed", value: "unemployed" },
    { label: "Self-employed", value: "self-employed" },
  ]);

  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setForm({
          name: data.user?.name || "",
          age: data.user?.age?.toString() || "",
          gender: data.userDetails?.gender || "",
          maritalStatus: data.userDetails?.maritalStatus || "",
          occupation: data.userDetails?.occupation || "",
          employmentStatus: data.userDetails?.employmentStatus || "",
          education: data.userDetails?.education || "",
          address: data.userDetails?.address || "",
          phone: data.userDetails?.phone || "",
        });
      } catch (error) {
        Alert.alert("Error", "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile({ ...form, age: parseInt(form.age) });
      const updated = await getProfile();
      setProfile(updated);
      setForm({
        name: updated.user?.name || "",
        age: updated.user?.age?.toString() || "",
        gender: updated.userDetails?.gender || "",
        maritalStatus: updated.userDetails?.maritalStatus || "",
        occupation: updated.userDetails?.occupation || "",
        employmentStatus: updated.userDetails?.employmentStatus || "",
        education: updated.userDetails?.education || "",
        address: updated.userDetails?.address || "",
        phone: updated.userDetails?.phone || "",
      });
      Alert.alert("Success", "Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", error.msg || "Update failed");
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      logout();
      setLoggingOut(false);
    }, 1000);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#15803D" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load profile data.</Text>
      </View>
    );
  }

  const { user, userDetails } = profile;

  const renderItem = ({ item }) => item;

  const editableField = (label, key, isDropdown, dropdownProps = {}) => {
    return (
      <View key={key}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
          isDropdown ? (
            <DropDownPicker
              value={form[key]}
              setValue={(callback) => handleChange(key, callback(form[key]))}
              setItems={() => {}}
              style={styles.dropdown}
              containerStyle={{ marginBottom: 10 }}
              {...dropdownProps}
            />
          ) : (
            <TextInput
              style={styles.input}
              value={form[key]}
              onChangeText={(text) => handleChange(key, text)}
              keyboardType={key === "age" || key === "phone" ? "numeric" : "default"}
            />
          )
        ) : (
          <Text style={styles.value}>{form[key] || "N/A"}</Text>
        )}
      </View>
    );
  };

  const formComponents = [
    <TouchableOpacity key="back" style={styles.backButton} onPress={() => navigation.goBack()}>
      <Text style={styles.backText}>← Back</Text>
    </TouchableOpacity>,
    <View key="profile-header" style={styles.profileHeader}>
      <Image
        source={{
          uri: user?.profilePicture || "https://i.pinimg.com/originals/a8/57/00/a85700f3c614f6313750b9d8196c08f5.png",
        }}
        style={styles.profileImage}
      />
      <Text style={styles.profileName}>{form.name || "N/A"}</Text>
      <Text style={styles.profileEmail}>{user?.email || "N/A"}</Text>
    </View>,
    <View key="form-card" style={styles.card}>
      {editableField("Name", "name")}
      {editableField("Gender", "gender", true, {
        open: genderOpen,
        setOpen: setGenderOpen,
        items: genderOptions,
        placeholder: "Select Gender",
        zIndex: 3000,
        zIndexInverse: 1000,
      })}
      {editableField("Age", "age")}
      {editableField("Marital Status", "maritalStatus", true, {
        open: maritalOpen,
        setOpen: setMaritalOpen,
        items: maritalOptions,
        placeholder: "Select Marital Status",
        zIndex: 2000,
        zIndexInverse: 2000,
      })}
      {editableField("Occupation", "occupation")}
      {editableField("Employment Status", "employmentStatus", true, {
        open: employmentOpen,
        setOpen: setEmploymentOpen,
        items: employmentOptions,
        placeholder: "Select Employment Status",
        zIndex: 1000,
        zIndexInverse: 3000,
      })}
      {editableField("Education", "education")}
      {editableField("Address", "address")}
      {editableField("Phone", "phone")}
    </View>,
    <TouchableOpacity
      key="edit-save"
      style={[styles.logoutButton, { backgroundColor: "#007bff" }]}
      onPress={isEditing ? handleSave : () => setIsEditing(true)}
    >
      <Text style={styles.buttonText}>{isEditing ? "Save" : "Edit Profile"}</Text>
    </TouchableOpacity>,
    <Animated.View key="logout" style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.buttonText}>Logout</Text>}
      </TouchableOpacity>
    </Animated.View>,
  ];

  return (
    <FlatList
      data={formComponents}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  backText: {
    fontSize: 18,
    color: "#15803D",
    fontWeight: "bold",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  logoutButtonDisabled: {
    backgroundColor: "#b52b27",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
});

export default ProfileScreen;
