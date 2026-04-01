import React, { useState } from "react";
import { Text, TextInput } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import { api } from "../../services/api";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  return (
    <ScreenContainer>
      <Text>Enter your email to receive reset instructions.</Text>
      <TextInput style={{ backgroundColor: "#FFF", padding: 14, borderRadius: 14 }} placeholder="Email" onChangeText={setEmail} />
      <AppButton
        title="Send OTP"
        onPress={async () => {
          await api.post("/auth/forgot-password", { email });
          navigation.navigate("OTPVerification", { target: email, purpose: "password_reset" });
        }}
      />
    </ScreenContainer>
  );
}
