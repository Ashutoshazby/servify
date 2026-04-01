import React, { useEffect } from "react";
import ScreenContainer from "../../components/ScreenContainer";
import BookingCard from "../../components/BookingCard";
import AppButton from "../../components/AppButton";
import { useAppStore } from "../../store/appStore";

export default function IncomingRequestsScreen() {
  const { bookings, fetchBookings, updateBookingStatus } = useAppStore();

  useEffect(() => {
    fetchBookings("provider");
  }, [fetchBookings]);

  return (
    <ScreenContainer>
      {bookings.map((booking) => (
        <React.Fragment key={booking._id}>
          <BookingCard booking={booking} />
          <AppButton title="Accept" onPress={() => updateBookingStatus(booking._id, "accepted")} />
          <AppButton title="Reject" variant="secondary" onPress={() => updateBookingStatus(booking._id, "cancelled")} />
        </React.Fragment>
      ))}
    </ScreenContainer>
  );
}
