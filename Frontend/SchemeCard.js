import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, useWindowDimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from '@expo/vector-icons';
import { PanResponder, Animated } from "react-native";
const SchemeCard = ({ item }) => {
  if (!item || !item.title) return null;
  const [expanded, setExpanded] = useState(false);
  const { width } = useWindowDimensions();
  const slideX = useState(new Animated.Value(0))[0];
const slideThreshold = width * 0.5; 
const [isUnlocked, setIsUnlocked] = useState(false);

const panResponder = PanResponder.create({
  onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
  onPanResponderMove: Animated.event([null, { dx: slideX }], { useNativeDriver: false }),
  onPanResponderRelease: (_, gestureState) => {
    if (gestureState.dx > slideThreshold) {
      Animated.timing(slideX, {
        toValue: width * 0.7,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setIsUnlocked(true);
        item.link && Linking.openURL(item.link);
        slideX.setValue(0); 
        setIsUnlocked(false);
      });
    } else {
      Animated.spring(slideX, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  },
});

  return (
    <View style={[styles.schemeCard, { width: width * 0.9 }]}> 
      <View style={styles.headerRow}>
      <MaterialIcons name="assignment" size={24} color="black" />
        <Text style={styles.schemeTitle}>{item.title || "No Title Available"}</Text>
      </View>

      <View style={styles.headerRow}>
        <Icon name="label-outline" size={18} color="#666" />
        <Text style={styles.schemeCategory}>{item.category || "Uncategorized"}</Text>
      </View>

      <Text style={styles.schemeSummary} numberOfLines={expanded ? undefined : 3}>
        {expanded ? item.description || "No Description" : `${item.description?.substring(0, 100)}...`}
      </Text>

      <TouchableOpacity style={styles.viewMoreBtn} onPress={() => setExpanded(!expanded)}>
        <Text style={styles.viewMoreText}>{expanded ? "View Less" : "View More"}</Text>
      </TouchableOpacity>

      {item.link ? (
  <View style={styles.sliderContainer}>
    <Animated.View
      style={[
        styles.sliderButton,
        { transform: [{ translateX: slideX }] }
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.sliderContent}>
        <MaterialIcons name={isUnlocked ? "lock-open" : "lock"} size={20} color="white" />
        <Text style={styles.sliderText}>Slide to Apply</Text>
        <MaterialIcons name="chevron-right" size={22} color="white" />
      </View>
    </Animated.View>
  </View>
) : (
  <Text style={styles.noLinkText}>No Link Available</Text>
)}

    </View>
  );
};

const styles = StyleSheet.create({
  schemeCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  schemeTitle: { fontWeight: "bold", marginLeft: 5, flexShrink: 1 },
  schemeCategory: { fontSize: 14, color: "#666", marginLeft: 5 },
  schemeSummary: { fontSize: 14, marginBottom: 5, flexShrink: 1 },
  viewMoreBtn: { paddingVertical: 5 },
  viewMoreText: { color: "#15803D" },
  applyButton: {
    backgroundColor: "#6200ee",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  applyText: { color: "white", fontWeight: "bold" },
  noLinkText: { color: "#999", textAlign: "center", marginTop: 10 },
  sliderContainer: {
    height: 50,
    backgroundColor: "#15803D",
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    position: "relative",
  },
  
  sliderButton: {
    height: "100%",
    borderRadius: 25,
    justifyContent: "center",
    paddingHorizontal: 20,
    position: "absolute",
    left: 0,
  },
  
  sliderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  sliderText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 14,
  },
  
  
});

export default SchemeCard;
