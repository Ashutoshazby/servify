import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import OTPVerificationScreen from "../screens/auth/OTPVerificationScreen";
import HomeScreen from "../screens/customer/HomeScreen";
import ServiceCategoriesScreen from "../screens/customer/ServiceCategoriesScreen";
import SearchServicesScreen from "../screens/customer/SearchServicesScreen";
import ProviderListScreen from "../screens/customer/ProviderListScreen";
import ProviderProfileScreen from "../screens/customer/ProviderProfileScreen";
import BookServiceScreen from "../screens/customer/BookServiceScreen";
import SelectDateTimeScreen from "../screens/customer/SelectDateTimeScreen";
import BookingConfirmationScreen from "../screens/customer/BookingConfirmationScreen";
import PaymentScreen from "../screens/customer/PaymentScreen";
import PaymentSuccessScreen from "../screens/customer/PaymentSuccessScreen";
import PaymentFailureScreen from "../screens/customer/PaymentFailureScreen";
import MyBookingsScreen from "../screens/customer/MyBookingsScreen";
import BookingDetailsScreen from "../screens/customer/BookingDetailsScreen";
import NotificationsScreen from "../screens/shared/NotificationsScreen";
import UserProfileScreen from "../screens/shared/UserProfileScreen";
import SettingsScreen from "../screens/shared/SettingsScreen";
import DebugToolsScreen from "../screens/shared/DebugToolsScreen";
import ProviderDashboardScreen from "../screens/provider/ProviderDashboardScreen";
import IncomingRequestsScreen from "../screens/provider/IncomingRequestsScreen";
import ServiceScheduleScreen from "../screens/provider/ServiceScheduleScreen";
import CompletedJobsScreen from "../screens/provider/CompletedJobsScreen";
import EarningsDashboardScreen from "../screens/provider/EarningsDashboardScreen";
import ProviderProfileManageScreen from "../screens/provider/ProviderProfileManageScreen";
import AvailabilitySettingsScreen from "../screens/provider/AvailabilitySettingsScreen";
import { useAuthStore } from "../store/authStore";
import { colors } from "../utils/theme";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function getCustomerTabIcon(routeName, color, size) {
  const iconMap = {
    Home: "home-variant",
    Categories: "view-grid",
    Bookings: "clipboard-text-clock",
    Profile: "account-circle",
  };

  return <MaterialCommunityIcons name={iconMap[routeName] || "circle"} size={size} color={color} />;
}

function CustomerTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#64748B",
        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          backgroundColor: "#FFFFFF",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size }) => getCustomerTabIcon(route.name, color, size),
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Categories" component={ServiceCategoriesScreen} />
      <Tabs.Screen name="Bookings" component={MyBookingsScreen} />
      <Tabs.Screen name="Profile" component={UserProfileScreen} />
    </Tabs.Navigator>
  );
}

function ProviderTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Dashboard" component={ProviderDashboardScreen} />
      <Tabs.Screen name="Requests" component={IncomingRequestsScreen} />
      <Tabs.Screen name="Schedule" component={ServiceScheduleScreen} />
      <Tabs.Screen name="Earnings" component={EarningsDashboardScreen} />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        </>
      ) : user.role === "provider" ? (
        <>
          <Stack.Screen name="ProviderTabs" component={ProviderTabs} options={{ headerShown: false }} />
          <Stack.Screen name="CompletedJobs" component={CompletedJobsScreen} />
          <Stack.Screen name="ProviderProfileManage" component={ProviderProfileManageScreen} />
          <Stack.Screen name="AvailabilitySettings" component={AvailabilitySettingsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="CustomerTabs" component={CustomerTabs} options={{ headerShown: false }} />
          <Stack.Screen name="SearchServices" component={SearchServicesScreen} />
          <Stack.Screen name="ProviderList" component={ProviderListScreen} />
          <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} />
          <Stack.Screen name="BookService" component={BookServiceScreen} />
          <Stack.Screen name="SelectDateTime" component={SelectDateTimeScreen} />
          <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
          <Stack.Screen name="PaymentFailure" component={PaymentFailureScreen} />
          <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="DebugTools" component={DebugToolsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
