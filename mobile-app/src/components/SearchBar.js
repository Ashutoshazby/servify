import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { colors } from "../utils/theme";

export default function SearchBar({ value, onChangeText, placeholder = "Search services" }) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.subtext}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14
  }
});
