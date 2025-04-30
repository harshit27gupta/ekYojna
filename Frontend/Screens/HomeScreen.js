import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DropDownPicker from "react-native-dropdown-picker";
import SchemeCard from "../SchemeCard";

const API_URL = "http://192.168.158.130:4000/schemes";

const categories = [
  "Agriculture & Rural Development",
  "Employment & Business",
  "Education & Scholarships",
  "Healthcare & Insurance",
  "Women & Child Welfare",
  "Financial Support & Loans",
  "Housing & Infrastructure",
  "Technology & Innovation",
  "Social Welfare & Disability Support",
  "Environment & Sustainability",
];

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch(API_URL);
        const text = await response.text();
        const data = JSON.parse(text);
        setSchemes(data);
        setFilteredSchemes(data);
      } catch (error) {
        console.error("Error fetching schemes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const filterSchemes = (query, categories, subCats = []) => {
    let results = schemes;

    if (query.length > 0) {
      results = results.filter((scheme) =>
        scheme.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (categories.length > 0) {
      results = results.filter((scheme) =>
        categories.includes(scheme.category)
      );
    }

    if (
      categories.length === 1 &&
      categories[0] === "Agriculture & Rural Development" &&
      Array.isArray(subCats) &&
      subCats.length > 0
    ) {
      results = results.filter((scheme) =>
        subCats.includes(scheme.subCategory)
      );
    }

    setFilteredSchemes(results);
    setVisibleCount(5);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterSchemes(query, selectedCategories, selectedSubcategories);
  };

  const toggleCategory = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);

    const isAgriSelected =
      updatedCategories.length === 1 &&
      updatedCategories[0] === "Agriculture & Rural Development";

    setShowAdvancedFilter(isAgriSelected);

    if (isAgriSelected) {
      const agriSubcategories = [
        ...new Set(
          schemes
            .filter((s) => s.category === "Agriculture & Rural Development")
            .map((s) => s.subCategory)
        ),
      ];
      setAvailableSubcategories(agriSubcategories);
      setDropdownItems(
        agriSubcategories.map((sub) => ({ label: sub, value: sub }))
      );
    } else {
      setSelectedSubcategories([]);
    }

    filterSchemes(searchQuery, updatedCategories, selectedSubcategories);
  };

  const handleSubcategoryChange = useCallback(
    (items) => {
      setDropdownOpen(false); 
      setSelectedSubcategories(items);
      filterSchemes(searchQuery, selectedCategories, items);
    },
    [searchQuery, selectedCategories]
  );

  const removeSubcategory = (subCat) => {
    const updated = selectedSubcategories.filter((s) => s !== subCat);
    setSelectedSubcategories(updated);
    filterSchemes(searchQuery, selectedCategories, updated);
  };

  const renderScheme = ({ item }) => <SchemeCard item={item} />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 25 }}
            >
             <View style={styles.headerRow}>
  <TouchableOpacity onPress={() => navigation?.navigate("Profile")}>
    <Icon name="account-circle" size={32} color="#15803D" />
  </TouchableOpacity>
  <Text style={styles.headerText}>Discover Government Schemes!</Text>
</View>


              <View style={styles.searchWrapper}>
                <View style={styles.searchContainer}>
                  <Icon name="magnify" size={22} color="#666" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholderTextColor="#999"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={() => handleSearch("")}
                      style={styles.clearButton}
                    >
                      <Icon name="close-circle" size={18} color="#888" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.categoryWrapper}>
                <Text style={styles.sectionTitle}>Browse by Categories</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScroll}
                >
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        selectedCategories.includes(category) &&
                          styles.categorySelected,
                      ]}
                      onPress={() => toggleCategory(category)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          selectedCategories.includes(category) &&
                            styles.categoryTextSelected,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              {showAdvancedFilter && (
                <>
                  <View style={styles.dropdownHeader}>
                    <Text style={styles.dropdownLabel}>Advanced Filter</Text>
                    <Icon name="plus-circle" size={20} color="#15803D" />
                  </View>

                  <DropDownPicker
              open={dropdownOpen}
              setOpen={setDropdownOpen}
              multiple={true}
              min={0}
              max={10}
              showsVerticalScrollIndicator={false}
              value={selectedSubcategories}
              setValue={handleSubcategoryChange}
              items={dropdownItems}
              setItems={setDropdownItems}
              placeholder="Select Subcategories"
              listMode="SCROLLVIEW"
              style={{ marginBottom: dropdownOpen ? 180 : 10 }}
              dropDownDirection="BOTTOM"
              dropDownContainerStyle={{ zIndex: 9999 }}
            />

                  <View style={styles.chipContainer}>
                    {selectedSubcategories.map((subCat) => (
                      <View key={subCat} style={styles.selectedChip}>
                        <Text style={{ color: "white" }}>{subCat}</Text>
                        <TouchableOpacity
                          onPress={() => removeSubcategory(subCat)}
                        >
                          <Icon name="close" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.sectionTitle}>Schemes</Text>
            </ScrollView>
          }
          data={filteredSchemes.slice(0, visibleCount)}
          renderItem={renderScheme}
          keyExtractor={(item) => item._id.toString()}
          ListFooterComponent={
            visibleCount < filteredSchemes.length ? (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setVisibleCount(visibleCount + 5)}
              >
                <Text style={styles.viewMoreText}>View More</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f2f5" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#15803D",
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#15803D",
    textAlign: "center",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  
  profileIcon: {
    position: "absolute",
    top: 10,
    left:0,
    zIndex: 10,
    padding: 5,
  },
  searchWrapper: { alignItems: "center" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    width: "80%",
    elevation: 3,
  },
  clearButton: {
    marginLeft: 10,
    backgroundColor: "#ddd",
    borderRadius: 12,
    padding: 2,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginTop: 20 },
  categoryWrapper: { marginVertical: 15 },
  categoryScroll: { flexDirection: "row", paddingVertical: 5 },
  categoryChip: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },
  categorySelected: { backgroundColor: "#15803D" },
  categoryText: { fontSize: 14, color: "#444" },
  categoryTextSelected: { color: "white", fontWeight: "bold" },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  dropdownLabel: {
    marginLeft: 5,
    color: "#15803D",
    fontWeight: "bold",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  selectedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#15803D",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  viewMoreButton: {
    alignSelf: "center",
    backgroundColor: "#15803D",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  viewMoreText: { color: "white", fontWeight: "bold" },
});

export default HomeScreen;
