import React from "react";
import { Text } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import { useAppStore } from "../../store/appStore";

export default function BookingConfirmationScreen({ navigation }) {
  const { selectedBookingDraft, selectedProvider, selectedCategory } = useAppStore();

  return (
    <ScreenContainer>
      <Text>Review service details, provider, time, price, and promo code.</Text>
      <Text>Category: {selectedCategory?.name}</Text>
      <Text>Provider: {selectedProvider?.userId?.name}</Text>
      <Text>Date: {selectedBookingDraft?.date}</Text>
      <Text>Time: {selectedBookingDraft?.time}</Text>
      <Text>Address: {selectedBookingDraft?.address}</Text>
      <Text>Estimated price: Rs. {selectedProvider?.servicesOffered?.[0]?.basePrice || 499}</Text>
      <AppButton title="Proceed to payment" onPress={() => navigation.navigate("Payment")} />
    </ScreenContainer>
  );
}
