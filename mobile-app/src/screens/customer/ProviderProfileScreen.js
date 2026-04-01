import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import ProviderCard from "../../components/ProviderCard";
import { useAppStore } from "../../store/appStore";
import EmptyState from "../../components/EmptyState";
import SkeletonCard from "../../components/SkeletonCard";
import { colors } from "../../utils/theme";

export default function ProviderProfileScreen({ navigation, route }) {
  const { selectedProvider, fetchProviderById, fetchReviews, reviews } = useAppStore();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const loadProvider = async () => {
    try {
      if (route.params?.providerId) {
        setError("");
        setLoading(true);
        await Promise.all([fetchProviderById(route.params.providerId), fetchReviews(route.params.providerId)]);
      }
    } catch (_error) {
      setError("Unable to load provider profile.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadProvider();
  }, [fetchProviderById, fetchReviews, route.params]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Provider profile</Text>
      {loading ? <SkeletonCard /> : error ? <EmptyState title="Provider unavailable" subtitle={error} actionTitle="Retry" onAction={loadProvider} /> : selectedProvider ? <ProviderCard provider={selectedProvider} /> : <EmptyState title="No provider data" />}
      {selectedProvider ? (
        <View style={styles.serviceAreaCard}>
          <Text style={styles.serviceAreaTitle}>Primary service area</Text>
          <Text style={styles.serviceAreaText}>
            Covering {selectedProvider.location?.address || "Sector 62, Noida"} and nearby sectors with flexible time slots.
          </Text>
        </View>
      ) : null}
      {reviews.length ? reviews.map((review) => (
        <View key={review._id} style={styles.reviewCard}>
          <Text style={styles.reviewAuthor}>{review.userId?.name}</Text>
          <Text style={styles.reviewBody}>{review.comment || `${review.rating} stars`}</Text>
        </View>
      )) : <EmptyState title="No reviews yet" subtitle="This provider has not been rated yet." />}
      <AppButton title="Book now" onPress={() => navigation.navigate("BookService")} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  serviceAreaCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  serviceAreaTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  serviceAreaText: {
    color: colors.subtext,
    lineHeight: 20,
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  reviewAuthor: {
    fontWeight: "700",
    color: colors.text,
  },
  reviewBody: {
    color: colors.subtext,
  },
});
