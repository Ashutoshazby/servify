import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import BrandHeader from "../../components/BrandHeader";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../utils/theme";

export default function UserProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <ScreenContainer>
      <BrandHeader
        compact
        title="Your profile"
        subtitle="Manage account details, saved preferences, and service activity for Noida bookings."
      />
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(user?.name || "U").charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.meta}>{user?.email}</Text>
        <Text style={styles.meta}>{user?.phone}</Text>
        <Text style={styles.location}>Preferred area: Sector 62, Noida</Text>
      </View>
      <AppButton title="Logout" variant="secondary" onPress={logout} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  meta: {
    color: colors.subtext,
  },
  location: {
    marginTop: 4,
    color: colors.text,
    fontWeight: "600",
  },
});
