import React from "react";
import { Text } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";

export default function PaymentSuccessScreen({ navigation }) {
  return (
    <ScreenContainer>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Payment Successful</Text>
      <Text>Your booking has been confirmed.</Text>
      <AppButton title="View bookings" onPress={() => navigation.navigate("Bookings")} />
    </ScreenContainer>
  );
}
