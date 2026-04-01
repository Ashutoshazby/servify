import React from "react";
import { Text } from "react-native";
import Toast from "react-native-toast-message";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import { useAppStore } from "../../store/appStore";
import { useUiStore } from "../../store/uiStore";

export default function PaymentScreen({ navigation }) {
  const {
    selectedBookingDraft,
    selectedProvider,
    createBooking,
    clearBookingDraft,
  } = useAppStore();
  const setLoading = useUiStore((state) => state.setLoading);
  const [error, setError] = React.useState("");

  return (
    <ScreenContainer>
      <Text>Payment screen</Text>
      <Text>Confirm your booking request now. Online payment can be enabled again after native gateway setup is finalized.</Text>
      {error ? <Text style={{ color: "#EF4444" }}>{error}</Text> : null}
      <AppButton
        title="Confirm booking request"
        onPress={async () => {
          try {
            setError("");
            setLoading(true, "Creating your booking...");
            const booking = await createBooking({
              providerId: selectedProvider._id,
              serviceId: selectedProvider.servicesOffered?.[0]?._id,
              date: selectedBookingDraft.date,
              time: selectedBookingDraft.time,
              price: selectedProvider.servicesOffered?.[0]?.basePrice || 499,
              address: selectedBookingDraft.address,
              notes: selectedBookingDraft.notes,
            });
            setLoading(false);
            clearBookingDraft();
            Toast.show({ type: "success", text1: "Booking submitted", text2: "Your provider will review and confirm shortly." });
            navigation.navigate("PaymentSuccess", {
              booking: {
                ...booking,
                paymentStatus: "pending",
                status: booking.status || "pending",
              },
            });
          } catch (checkoutError) {
            setLoading(false);
            const message = checkoutError?.description || checkoutError?.message || "Unable to complete payment.";
            setError(message);
            Toast.show({ type: "error", text1: "Booking failed", text2: message });
            navigation.navigate("PaymentFailure", { message });
          }
        }}
      />
      <AppButton
        title="Back to booking"
        variant="secondary"
        onPress={() => navigation.goBack()}
      />
    </ScreenContainer>
  );
}
