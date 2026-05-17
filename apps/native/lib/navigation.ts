import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const baseStackScreenOptions: NativeStackNavigationOptions = {
  headerBackButtonDisplayMode: "minimal",
  headerShadowVisible: false,
  headerTitle: "",
  headerStyle: {
    backgroundColor: "#F5F0E6",
  },
  headerTintColor: "#173331",
  contentStyle: {
    backgroundColor: "#F5F0E6",
  },
};
