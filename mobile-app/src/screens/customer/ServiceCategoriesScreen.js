import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import CategoryGrid from "../../components/CategoryGrid";
import { useAppStore } from "../../store/appStore";
import BrandHeader from "../../components/BrandHeader";
import { colors } from "../../utils/theme";

export default function ServiceCategoriesScreen({ navigation }) {
  const { categories, fetchCategories, setCategory } = useAppStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <ScreenContainer>
      <BrandHeader
        compact
        title="Explore categories"
        subtitle="Find top-rated home services across Noida sectors, from quick fixes to full home care."
      />
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Handpicked categories</Text>
        <Text style={styles.bannerText}>Browse popular options and connect with nearby verified professionals.</Text>
      </View>
      <CategoryGrid categories={categories} onSelect={(category) => { setCategory(category); navigation.navigate("ProviderList", { category }); }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#FFF7ED",
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  bannerText: {
    color: colors.subtext,
    lineHeight: 20,
  },
});
