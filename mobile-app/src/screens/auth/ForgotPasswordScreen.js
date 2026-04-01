import React, { useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import { api } from "../../services/api";
import BrandHeader from "../../components/BrandHeader";
import { colors } from "../../utils/theme";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <ScreenContainer>
      <BrandHeader
        title="Forgot password"
        subtitle="Enter your email and we will send an OTP to reset your password."
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#94A3B8"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton
        title={loading ? "Sending OTP..." : "Send OTP"}
        disabled={loading}
        onPress={async () => {
          try {
            setLoading(true);
            setError("");
            await api.post("/auth/forgot-password", { email });
            navigation.navigate("OTPVerification", { target: email, purpose: "password_reset" });
          } catch (requestError) {
            setError(requestError?.response?.data?.message || "Unable to send reset OTP.");
          } finally {
            setLoading(false);
          }
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: colors.text,
  },
  error: {
    color: colors.danger,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 12,
  },
});
