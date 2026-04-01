import React, { useState } from "react";
import { Text } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import SearchBar from "../../components/SearchBar";
import ServiceCard from "../../components/ServiceCard";
import { useAppStore } from "../../store/appStore";

export default function SearchServicesScreen() {
  const [search, setSearch] = useState("");
  const { services, fetchServices } = useAppStore();

  React.useEffect(() => {
    fetchServices(search ? { search } : {});
  }, [fetchServices, search]);

  return (
    <ScreenContainer>
      <SearchBar value={search} onChangeText={setSearch} />
      {services.length ? services.map((service) => <ServiceCard key={service._id} service={service} />) : <Text>No services found.</Text>}
    </ScreenContainer>
  );
}
