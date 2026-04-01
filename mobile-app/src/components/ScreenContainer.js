import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { colors } from "../utils/theme";

export default function ScreenContainer({ children, scroll = true }) {
  const Wrapper = scroll ? ScrollView : SafeAreaView;

  return (
    <View style={styles.shell}>
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />
      <Wrapper contentContainerStyle={styles.content} style={styles.container}>
        {children}
      </Wrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    padding: 20,
    paddingBottom: 28,
    gap: 16,
  },
  topGlow: {
    position: "absolute",
    top: -70,
    right: -20,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#C7D2FE",
    opacity: 0.55,
  },
  bottomGlow: {
    position: "absolute",
    bottom: -60,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: "#BFDBFE",
    opacity: 0.35,
  },
});
