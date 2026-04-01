import React from "react";
import { Text } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";

export default function ProviderDashboardScreen() {
  return (
    <ScreenContainer>
      <Text style={{ fontSize: 26, fontWeight: "800" }}>Provider dashboard</Text>
      <Text>Track requests, schedule, and earnings at a glance.</Text>
    </ScreenContainer>
  );
}
