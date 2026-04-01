import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation/RootNavigator";
import { useThemeStore } from "./src/store/themeStore";
import { useAuthStore } from "./src/store/authStore";
import { useAppStore } from "./src/store/appStore";
import LoadingOverlay from "./src/components/LoadingOverlay";
import { attachNotificationListeners, registerForPushNotifications, syncDeviceToken } from "./src/services/notifications";

export default function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const token = useAuthStore((state) => state.token);
  const addNotification = useAppStore((state) => state.addNotification);

  React.useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  React.useEffect(() => {
    if (!token) return undefined;

    let dispose;

    const initNotifications = async () => {
      const deviceToken = await registerForPushNotifications();
      await syncDeviceToken(deviceToken);
      dispose = attachNotificationListeners({
        onReceive: (notification) => {
          const message = {
            title: notification.request.content.title || "Servify update",
            body: notification.request.content.body || "",
          };
          addNotification(message);
          Toast.show({ type: "success", text1: message.title, text2: message.body });
        },
        onRespond: (response) => {
          const title = response.notification.request.content.title || "Servify";
          addNotification({ title, body: response.notification.request.content.body || "" });
        },
      });
    };

    initNotifications();

    return () => dispose?.();
  }, [addNotification, token]);

  return (
    <>
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <RootNavigator />
      </NavigationContainer>
      <LoadingOverlay />
      <Toast />
    </>
  );
}
