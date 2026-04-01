import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import BrandHeader from "../../components/BrandHeader";
import { colors } from "../../utils/theme";
import { useAuthStore } from "../../store/authStore";
import { api } from "../../services/api";

export default function RegisterScreen({ navigation }) {
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "customer" });
  const [resendingOtp, setResendingOtp] = useState(false);
  const [helperMessage, setHelperMessage] = useState("");
  const emailAlreadyRegistered = useMemo(
    () => error?.toLowerCase().includes("email already registered"),
    [error]
  );

  return (
    <ScreenContainer>
      <BrandHeader
        title="Create your account"
        subtitle="Set up Servify for quick doorstep help in Noida, from Sector 18 to Sector 137."
      />
      {["name", "email", "phone", "password"].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field[0].toUpperCase() + field.slice(1)}
          placeholderTextColor="#94A3B8"
          secureTextEntry={field === "password"}
          autoCapitalize={field === "email" ? "none" : "sentences"}
          keyboardType={field === "email" ? "email-address" : field === "phone" ? "phone-pad" : "default"}
          value={form[field]}
          onChangeText={(value) => {
            setHelperMessage("");
            setForm({ ...form, [field]: value });
          }}
        />
      ))}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {helperMessage ? <Text style={styles.success}>{helperMessage}</Text> : null}
      <AppButton title={loading ? "Registering..." : "Register as Customer"} disabled={loading} onPress={async () => { try { await register(form); navigation.navigate("OTPVerification", { target: form.email, purpose: "register_verify" }); } catch (_error) {} }} />
      <AppButton title="Register as Provider" variant="secondary" disabled={loading} onPress={async () => { try { await register({ ...form, role: "provider" }); navigation.navigate("OTPVerification", { target: form.email, purpose: "register_verify" }); } catch (_error) {} }} />
      {emailAlreadyRegistered ? (
        <AppButton
          title={resendingOtp ? "Sending verification OTP..." : "Already registered? Verify account"}
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
              setHelperMessage("Verification OTP sent. Use it to activate your account.");
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
