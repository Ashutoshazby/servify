import React, { useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import BrandHeader from "../../components/BrandHeader";
import { colors } from "../../utils/theme";
import { useAuthStore } from "../../store/authStore";

export default function LoginScreen({ navigation }) {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <ScreenContainer>
      <BrandHeader
        title="Welcome back"
        subtitle="Book trusted plumbers, electricians, cleaners and more across Noida in just a few taps."
      />
      <TextInput style={styles.input} placeholder="Email" onChangeText={(email) => setForm({ ...form, email })} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={(password) => setForm({ ...form, password })} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton title={loading ? "Logging in..." : "Login"} disabled={loading} onPress={async () => { try { await login(form); } catch (_error) {} }} />
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
  },
  error: {
    color: colors.danger,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 12,
  },
});
