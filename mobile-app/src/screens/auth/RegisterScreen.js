import React, { useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import BrandHeader from "../../components/BrandHeader";
import { colors } from "../../utils/theme";
import { useAuthStore } from "../../store/authStore";

export default function RegisterScreen({ navigation }) {
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "customer" });

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
          onChangeText={(value) => setForm({ ...form, [field]: value })}
        />
      ))}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton title={loading ? "Registering..." : "Register as Customer"} disabled={loading} onPress={async () => { try { await register(form); navigation.navigate("OTPVerification", { target: form.email, purpose: "register_verify" }); } catch (_error) {} }} />
      <AppButton title="Register as Provider" variant="secondary" disabled={loading} onPress={async () => { try { await register({ ...form, role: "provider" }); navigation.navigate("OTPVerification", { target: form.email, purpose: "register_verify" }); } catch (_error) {} }} />
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
