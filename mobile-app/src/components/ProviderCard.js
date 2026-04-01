import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../utils/theme";

export default function ProviderCard({ provider }) {
  const name = provider.userId?.name || "Provider";
  const address = provider.location?.address || "Serving nearby sectors in Noida";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.meta}>
            Rating {provider.rating || 0} | {provider.experienceYears || 0} yrs experience
          </Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>
      <Text style={styles.address}>{address}</Text>
      <Text style={styles.bio}>{provider.bio || "Fast doorstep support for homes and offices in Noida."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primary,
  },
  titleWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  meta: {
    color: colors.subtext,
    fontSize: 13,
  },
  verifiedBadge: {
    backgroundColor: "#ECFDF5",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  verifiedText: {
    color: "#15803D",
    fontWeight: "700",
    fontSize: 12,
  },
  address: {
    color: colors.text,
    fontWeight: "600",
  },
  bio: {
    color: colors.subtext,
    lineHeight: 20,
  },
});
