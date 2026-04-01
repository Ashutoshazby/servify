import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import ProviderCard from "../../components/ProviderCard";
import { useAppStore } from "../../store/appStore";
import EmptyState from "../../components/EmptyState";
import SkeletonCard from "../../components/SkeletonCard";

export default function ProviderListScreen({ navigation, route }) {
  const { providers, fetchProviders, setProvider } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProviders = async () => {
    try {
      setError("");
      setLoading(true);
      await fetchProviders(route.params?.category?._id ? { categoryId: route.params.category._id } : {});
    } catch (_error) {
      setError("Unable to load providers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, [fetchProviders, route.params]);

  return (
    <ScreenContainer>
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : error ? (
        <EmptyState title="Provider load failed" subtitle={error} actionTitle="Retry" onAction={loadProviders} />
      ) : !providers.length ? (
        <EmptyState title="No providers found" subtitle="Try another category or check again later." />
      ) : providers.map((provider) => (
        <Pressable
          key={provider._id}
          onPress={() => {
            setProvider(provider);
            navigation.navigate("ProviderProfile", { providerId: provider._id });
          }}
        >
          <ProviderCard provider={provider} />
        </Pressable>
      ))}
    </ScreenContainer>
  );
}
