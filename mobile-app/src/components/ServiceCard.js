import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../utils/theme";

export default function ServiceCard({ service }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{service.name}</Text>
      <Text style={styles.description}>{service.description}</Text>
      <Text style={styles.price}>Starting at Rs. {service.basePrice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  title: { fontSize: 16, fontWeight: "700", color: colors.text },
  description: { marginTop: 6, color: colors.subtext },
  price: { marginTop: 12, color: colors.secondary, fontWeight: "700" }
});
