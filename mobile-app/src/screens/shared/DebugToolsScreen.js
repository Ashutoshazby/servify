import React from "react";
import { Text } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppButton from "../../components/AppButton";
import { registerForPushNotifications } from "../../services/notifications";
import { api } from "../../services/api";

export default function DebugToolsScreen() {
  const [token, setToken] = React.useState("");
  const [message, setMessage] = React.useState("");

  return (
    <ScreenContainer>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Debug Tools</Text>
      <Text selectable>{token || "No device token loaded yet."}</Text>
      <Text>{message}</Text>
      <AppButton
        title="Load Push Token"
        onPress={async () => {
          const pushToken = await registerForPushNotifications();
          setToken(pushToken || "");
        }}
      />
      <AppButton
        title="Send Test Notification"
        variant="secondary"
        onPress={async () => {
          if (!token) return;
          await api.post("/test/send-notification", {
            token,
            title: "Servify Test",
            body: "Push notifications are working.",
          });
          setMessage("Test notification requested.");
        }}
      />
    </ScreenContainer>
  );
}
