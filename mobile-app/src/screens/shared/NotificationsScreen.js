import React from "react";
import { Text } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import { useAppStore } from "../../store/appStore";
import EmptyState from "../../components/EmptyState";

export default function NotificationsScreen() {
  const notifications = useAppStore((state) => state.notifications);

  return (
    <ScreenContainer>
      {notifications.length ? notifications.map((item, index) => <Text key={`${item.title}-${index}`}>{item.title}: {item.body}</Text>) : <EmptyState title="No notifications yet" subtitle="Booking and payment updates will appear here." />}
    </ScreenContainer>
  );
}
