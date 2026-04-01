import React from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import { api } from "../../services/api";
import BrandHeader from "../../components/BrandHeader";
import { colors } from "../../utils/theme";

export default function OTPVerificationScreen({ route, navigation }) {
  const [code, setCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const purpose = route.params?.purpose || "register_verify";
  const isPasswordReset = purpose === "password_reset";

  return (
    <ScreenContainer>
      <BrandHeader
        title="Verify OTP"
        subtitle={`Enter the OTP sent to ${route.params?.target || "your registered contact"} to continue.`}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#94A3B8"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
      />
      {isPasswordReset ? (
        <TextInput
          style={styles.input}
          placeholder="New password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton
        title={loading ? "Processing..." : isPasswordReset ? "Reset password" : "Verify OTP"}
        disabled={loading}
        onPress={async () => {
          try {
            setLoading(true);
            setError("");
            if (isPasswordReset) {
              await api.post("/auth/reset-password", {
                email: route.params?.target,
                code,
                newPassword,
              });
              navigation.navigate("Login");
              return;
            }

            await api.post("/auth/verify-otp", {
              target: route.params?.target,
              purpose,
              channel: "email",
              code,
            });
            navigation.navigate("Login");
          } catch (verificationError) {
            setError(verificationError?.response?.data?.message || "OTP verification failed.");
          } finally {
            setLoading(false);
          }
        }}
      />
      <AppButton title="Back to login" variant="secondary" onPress={() => navigation.navigate("Login")} />
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
