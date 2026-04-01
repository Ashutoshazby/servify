import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../utils/theme";

export default function SkeletonCard() {
  return <View style={styles.card} />;
}

const styles = StyleSheet.create({
  card: {
    height: 110,
    borderRadius: 18,
    backgroundColor: colors.border,
    opacity: 0.55,
  },
});
