import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../utils/theme";

export default function CategoryGrid({ categories = [], onSelect }) {
  return (
    <View style={styles.grid}>
      {categories.map((category) => (
        <Pressable key={category._id || category.name} style={styles.item} onPress={() => onSelect?.(category)}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Popular</Text>
          </View>
          <Text style={styles.name}>{category.name}</Text>
          <Text style={styles.caption}>Trusted pros available across Noida sectors.</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  item: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    borderRadius: 18,
    gap: 10,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#15803D",
    fontWeight: "700",
    fontSize: 12,
  },
  name: {
    fontWeight: "800",
    color: colors.text,
    fontSize: 15,
  },
  caption: {
    color: colors.subtext,
    fontSize: 12,
    lineHeight: 18,
  },
});
