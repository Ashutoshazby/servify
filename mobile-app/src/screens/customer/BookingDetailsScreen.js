import React from "react";
import { Text, TextInput } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import { useAppStore } from "../../store/appStore";
import EmptyState from "../../components/EmptyState";

export default function BookingDetailsScreen({ route }) {
  const booking = route.params?.booking;
  const { submitReview } = useAppStore();
  const [rating, setRating] = React.useState("5");
  const [comment, setComment] = React.useState("");

  return (
    <ScreenContainer>
      {!booking ? (
        <EmptyState title="Booking not found" subtitle="Please return to your bookings and try again." />
      ) : (
        <>
      <Text>{booking?.serviceId?.name || "Booking detail"}</Text>
      <Text>Status: {booking?.status || "pending"}</Text>
      <Text>Payment: {booking?.paymentStatus || "pending"}</Text>
      <TextInput style={{ backgroundColor: "#FFF", padding: 14, borderRadius: 14 }} value={rating} onChangeText={setRating} />
      <TextInput style={{ backgroundColor: "#FFF", padding: 14, borderRadius: 14 }} value={comment} onChangeText={setComment} placeholder="Leave a review" />
      {booking?.providerId?._id ? (
        <AppButton title="Submit review" onPress={async () => { await submitReview({ providerId: booking.providerId._id, rating: Number(rating), comment }); }} />
      ) : null}
        </>
      )}
    </ScreenContainer>
  );
}
