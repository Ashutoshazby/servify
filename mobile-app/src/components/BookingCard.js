import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../utils/theme";

export default function BookingCard({ booking }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{booking.serviceId?.name || "Service booking"}</Text>
      <Text style={styles.meta}>{booking.date} at {booking.time}</Text>
      <Text style={styles.location}>{booking.address || "Scheduled in Noida"}</Text>
      <Text style={styles.status}>{booking.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
  },
  title: { fontWeight: "700", fontSize: 16, color: colors.text },
  meta: { marginTop: 6, color: colors.subtext },
  location: { color: colors.subtext },
  status: { marginTop: 10, color: colors.primary, fontWeight: "700", textTransform: "capitalize" }
});
