import React from "react";
import { Text } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";

export default function PaymentFailureScreen({ navigation, route }) {
  return (
    <ScreenContainer>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Payment Failed</Text>
      <Text>{route.params?.message || "Your payment could not be completed."}</Text>
      <AppButton title="Retry payment" onPress={() => navigation.goBack()} />
    </ScreenContainer>
  );
}
