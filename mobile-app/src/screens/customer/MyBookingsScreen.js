import React, { useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import BookingCard from "../../components/BookingCard";
import { useAppStore } from "../../store/appStore";
import EmptyState from "../../components/EmptyState";
import SkeletonCard from "../../components/SkeletonCard";
import BrandHeader from "../../components/BrandHeader";
import { colors } from "../../utils/theme";

export default function MyBookingsScreen({ navigation }) {
  const { bookings, fetchBookings } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      await fetchBookings("customer");
    } catch (_error) {
      setError("Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [fetchBookings]);

  return (
    <ScreenContainer scroll={false}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
              await fetchBookings("customer").catch(() => null);
              setRefreshing(false);
            }}
          />
        }
      >
      <BrandHeader
        compact
        title="Your bookings"
        subtitle="Track upcoming visits, reschedule plans, and review completed jobs in one place."
      />
      <View style={styles.summaryCard}>
        <Text style={styles.summaryCount}>{bookings.length}</Text>
        <Text style={styles.summaryLabel}>jobs in your history</Text>
      </View>
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : error ? (
        <EmptyState title="Booking history unavailable" subtitle={error} actionTitle="Retry" onAction={loadBookings} />
      ) : !bookings.length ? (
        <EmptyState title="No bookings yet" subtitle="Your completed and upcoming jobs will appear here." />
      ) : bookings.map((booking) => (
        <Pressable key={booking._id} onPress={() => navigation.navigate("BookingDetails", { booking })}>
          <BookingCard booking={booking} />
        </Pressable>
      ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 30,
    gap: 16,
  },
  summaryCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    gap: 4,
  },
  summaryCount: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
  },
  summaryLabel: {
    color: colors.subtext,
    fontWeight: "600",
  },
});
