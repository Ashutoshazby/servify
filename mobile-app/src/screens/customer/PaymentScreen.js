import React from "react";
import { Text } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import Toast from "react-native-toast-message";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import { useAppStore } from "../../store/appStore";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";

export default function PaymentScreen({ navigation }) {
  const {
    selectedBookingDraft,
    selectedProvider,
    createBooking,
    createPaymentOrder,
    verifyPayment,
    clearBookingDraft,
    markPaymentFailure,
  } = useAppStore();
  const user = useAuthStore((state) => state.user);
  const setLoading = useUiStore((state) => state.setLoading);
  const [error, setError] = React.useState("");

  return (
    <ScreenContainer>
      <Text>Payment screen</Text>
      <Text>Use Expo dev build plus Razorpay native SDK for full checkout.</Text>
      {error ? <Text style={{ color: "#EF4444" }}>{error}</Text> : null}
      <AppButton
        title="Pay with Razorpay"
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
            setLoading(true, "Preparing secure checkout...");
            const orderData = await createPaymentOrder(booking._id);
            setLoading(false);

            const options = {
              key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
              amount: orderData.order.amount,
              currency: orderData.order.currency,
              name: "Servify",
              description: selectedProvider.servicesOffered?.[0]?.name || "Service booking",
              order_id: orderData.order.id,
              prefill: {
                name: user?.name,
                email: user?.email,
                contact: user?.phone,
              },
              theme: { color: "#4F46E5" },
            };

            const paymentResult = await RazorpayCheckout.open(options);
            setLoading(true, "Verifying payment...");
            await verifyPayment({
              orderId: paymentResult.razorpay_order_id,
              paymentId: paymentResult.razorpay_payment_id,
              signature: paymentResult.razorpay_signature,
            });
            setLoading(false);
            clearBookingDraft();
            Toast.show({ type: "success", text1: "Payment successful", text2: "Your booking is confirmed." });
            navigation.navigate("PaymentSuccess", { booking: { ...booking, paymentStatus: "paid", status: "accepted" } });
          } catch (checkoutError) {
            setLoading(false);
            if (checkoutError?.razorpay_order_id) {
              await markPaymentFailure({
                orderId: checkoutError.razorpay_order_id,
                reason: checkoutError.description || "Payment was cancelled or failed",
              }).catch(() => null);
            }
            const message = checkoutError?.description || checkoutError?.message || "Unable to complete payment.";
            setError(message);
            Toast.show({ type: "error", text1: "Payment failed", text2: message });
            navigation.navigate("PaymentFailure", { message });
          }
        }}
      />
      <AppButton
        title="Use mock payment mode"
        variant="secondary"
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
            const orderData = await createPaymentOrder(booking._id);
            if (__DEV__) {
              await markPaymentFailure({ orderId: orderData.order.id, reason: "Mock payment mode enabled for development." }).catch(() => null);
            }
            setLoading(false);
            navigation.navigate("PaymentFailure", { message: "Mock payment mode completed. Switch to native checkout for real capture." });
          } catch (checkoutError) {
            setLoading(false);
            const message = checkoutError?.message || "Fallback flow failed.";
            setError(message);
          }
        }}
      />
    </ScreenContainer>
  );
}
