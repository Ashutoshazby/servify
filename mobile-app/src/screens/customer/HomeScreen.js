import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import CategoryGrid from "../../components/CategoryGrid";
import { useAppStore } from "../../store/appStore";
import EmptyState from "../../components/EmptyState";
import SkeletonCard from "../../components/SkeletonCard";
import BrandHeader from "../../components/BrandHeader";
import { colors } from "../../utils/theme";

export default function HomeScreen({ navigation }) {
  const { categories, fetchCategories, setCategory } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setError("");
      setLoading(true);
      await fetchCategories();
    } catch (_error) {
      setError("Could not load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [fetchCategories]);

  return (
    <ScreenContainer>
      <BrandHeader
        compact
        title="Services across Noida"
        subtitle="Choose a category and book reliable experts in Sector 18, Sector 62, Sector 75 and nearby areas."
      />
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Fast doorstep help</Text>
        <Text style={styles.heroText}>Transparent pricing, verified providers, and quick support for homes and offices.</Text>
      </View>
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : error ? (
        <EmptyState title="Could not load services" subtitle={error} actionTitle="Retry" onAction={loadCategories} />
      ) : categories.length ? (
        <CategoryGrid categories={categories} onSelect={(category) => { setCategory(category); navigation.navigate("ProviderList", { category }); }} />
      ) : (
        <EmptyState title="No categories available" subtitle="Check back after seeding service data." />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 18,
    gap: 8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  heroText: {
    color: "#E0E7FF",
    lineHeight: 20,
  },
});
