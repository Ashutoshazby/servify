import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useUiStore } from "../store/uiStore";
import { colors } from "../utils/theme";

export default function LoadingOverlay() {
  const loading = useUiStore((state) => state.loading);
  const loadingMessage = useUiStore((state) => state.loadingMessage);

  if (!loading) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>{loadingMessage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    zIndex: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  text: {
    color: colors.text,
    fontWeight: "600",
  },
});
