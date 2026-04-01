import React from "react";
import { Text, TextInput } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import { useAppStore } from "../../store/appStore";

export default function BookServiceScreen({ navigation }) {
  const { selectedProvider, setBookingDraft } = useAppStore();
  const [address, setAddress] = React.useState("");
  const [notes, setNotes] = React.useState("");

  return (
    <ScreenContainer>
      <Text>Confirm address, notes, and booking preferences.</Text>
      <Text>{selectedProvider?.userId?.name || "Selected provider"}</Text>
      <TextInput style={{ backgroundColor: "#FFF", padding: 14, borderRadius: 14 }} placeholder="Service address" value={address} onChangeText={setAddress} />
      <TextInput style={{ backgroundColor: "#FFF", padding: 14, borderRadius: 14 }} placeholder="Notes" value={notes} onChangeText={setNotes} />
      <AppButton title="Select date & time" onPress={() => { setBookingDraft({ address, notes }); navigation.navigate("SelectDateTime"); }} />
    </ScreenContainer>
  );
}
