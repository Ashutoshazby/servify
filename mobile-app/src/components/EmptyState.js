import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../utils/theme";
import AppButton from "./AppButton";

export default function EmptyState({ title, subtitle, actionTitle, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionTitle && onAction ? <View style={styles.action}><AppButton title={actionTitle} onPress={onAction} /></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    color: colors.subtext,
    textAlign: "center",
  },
  action: {
    marginTop: 12,
    width: "100%",
  },
});
