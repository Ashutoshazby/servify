import React from "react";
import { Text, TextInput } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import { api } from "../../services/api";

export default function OTPVerificationScreen({ route, navigation }) {
  const [code, setCode] = React.useState("");

  return (
    <ScreenContainer>
      <Text>Enter the OTP sent to {route.params?.target || "your registered contact"}.</Text>
      <TextInput
        style={{ backgroundColor: "#FFF", padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#E2E8F0" }}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
      />
      <AppButton
        title="Verify OTP"
        onPress={async () => {
          await api.post("/auth/verify-otp", {
            target: route.params?.target,
            purpose: route.params?.purpose || "register_verify",
            channel: "email",
            code,
          });
          navigation.goBack();
        }}
      />
    </ScreenContainer>
  );
}
