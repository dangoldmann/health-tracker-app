import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AppLayout = () => {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#F8FAFC",
          },
        }}
      />
    </>
  );
};

export default AppLayout;
