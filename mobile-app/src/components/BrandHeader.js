import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../utils/theme";

export default function BrandHeader({
  title = "Servify",
  subtitle = "Tap once. Get your task done.",
  align = "left",
  compact = false,
}) {
  const centered = align === "center";

  return (
    <View style={[styles.container, centered && styles.centered, compact && styles.compact]}>
      <Image source={require("../assets/servify-logo.png")} style={[styles.logo, compact && styles.logoCompact]} />
      <View style={centered && styles.centered}>
        <Text style={[styles.title, centered && styles.centerText]}>{title}</Text>
        <Text style={[styles.subtitle, centered && styles.centerText]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 8,
  },
  compact: {
    marginBottom: 0,
  },
  centered: {
    alignItems: "center",
  },
  logo: {
    width: 112,
    height: 112,
    resizeMode: "contain",
  },
  logoCompact: {
    width: 86,
    height: 86,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.subtext,
    maxWidth: 280,
  },
  centerText: {
    textAlign: "center",
  },
});
