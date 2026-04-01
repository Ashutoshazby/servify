import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import BrandHeader from "../../components/BrandHeader";
import { colors } from "../../utils/theme";
import { useAuthStore } from "../../store/authStore";
import { api } from "../../services/api";

export default function LoginScreen({ navigation }) {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const [form, setForm] = useState({ email: "", password: "" });
  const [resendingOtp, setResendingOtp] = useState(false);
  const [helperMessage, setHelperMessage] = useState("");
  const needsVerification = useMemo(
    () => error?.toLowerCase().includes("verify your email before logging in"),
    [error]
  );

  return (
    <ScreenContainer>
      <BrandHeader
        title="Welcome back"
        subtitle="Book trusted plumbers, electricians, cleaners and more across Noida in just a few taps."
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#94A3B8"
        autoCapitalize="none"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(email) => {
          setHelperMessage("");
          setForm({ ...form, email });
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        value={form.password}
        onChangeText={(password) => {
          setHelperMessage("");
          setForm({ ...form, password });
        }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {helperMessage ? <Text style={styles.success}>{helperMessage}</Text> : null}
      <AppButton title={loading ? "Logging in..." : "Login"} disabled={loading} onPress={async () => { try { await login(form); } catch (_error) {} }} />
      {needsVerification ? (
        <AppButton
          title={resendingOtp ? "Sending verification OTP..." : "Resend verification OTP"}
          variant="secondary"
          disabled={resendingOtp || !form.email.trim()}
          onPress={async () => {
            try {
              setResendingOtp(true);
              setHelperMessage("");
              await api.post("/auth/send-otp", {
                target: form.email.trim().toLowerCase(),
                channel: "email",
                purpose: "register_verify",
              });
              setHelperMessage("Verification OTP sent. Enter it to unlock login.");
              navigation.navigate("OTPVerification", {
                target: form.email.trim().toLowerCase(),
                purpose: "register_verify",
              });
            } catch (otpError) {
              setHelperMessage(otpError?.response?.data?.message || "Could not send verification OTP.");
            } finally {
              setResendingOtp(false);
            }
          }}
        />
      ) : null}
      <AppButton title="Create account" variant="secondary" onPress={() => navigation.navigate("Register")} />
      <AppButton title="Forgot password" variant="secondary" onPress={() => navigation.navigate("ForgotPassword")} />
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
  success: {
    color: colors.primary,
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 12,
  },
});
