import React from "react";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import { useThemeStore } from "../../store/themeStore";

export default function SettingsScreen({ navigation }) {
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <ScreenContainer>
      <AppButton title="Toggle dark mode" onPress={toggleTheme} />
      <AppButton title="Open debug tools" variant="secondary" onPress={() => navigation.navigate("DebugTools")} />
    </ScreenContainer>
  );
}
