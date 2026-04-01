import React from "react";
import { Text, TextInput } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import { useAppStore } from "../../store/appStore";

export default function SelectDateTimeScreen({ navigation }) {
  const { setBookingDraft } = useAppStore();
  const [date, setDate] = React.useState("2026-04-01");
  const [time, setTime] = React.useState("10:00");

  return (
    <ScreenContainer>
      <Text>Choose an available slot.</Text>
      <TextInput style={{ backgroundColor: "#FFF", padding: 14, borderRadius: 14 }} value={date} onChangeText={setDate} />
      <TextInput style={{ backgroundColor: "#FFF", padding: 14, borderRadius: 14 }} value={time} onChangeText={setTime} />
      <AppButton title="Continue" onPress={() => { setBookingDraft({ date, time }); navigation.navigate("BookingConfirmation"); }} />
    </ScreenContainer>
  );
}
