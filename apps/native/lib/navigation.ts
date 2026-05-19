import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const baseStackScreenOptions: NativeStackNavigationOptions = {
  headerBackButtonDisplayMode: "minimal",
  headerShadowVisible: false,
  headerTitle: "",
  headerStyle: {
    backgroundColor: "#F1ECE0",
  },
  headerTintColor: "#173331",
  contentStyle: {
    backgroundColor: "#F1ECE0",
  },
};
