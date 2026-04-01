import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../utils/theme";

export default function AppButton({ title, onPress, variant = "primary", disabled = false }) {
  return (
    <Pressable
      style={[styles.button, variant === "secondary" && styles.secondary, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: "#D7DEFE",
    shadowOpacity: 0,
    elevation: 0,
  },
  disabled: {
    opacity: 0.65,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryText: {
    color: colors.primary,
  },
});
