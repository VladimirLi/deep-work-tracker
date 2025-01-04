import { migrateIfNeeded } from "@/database/migration";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider
      databaseName="deep-work-tracker.db"
      onInit={migrateIfNeeded}
    >
      <PaperProvider
        theme={colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme}
      >
        <SafeAreaProvider>
          <Stack
            initialRouteName="index"
            screenOptions={{
              headerShown: false,
              animation: "fade",
            }}
          />
        </SafeAreaProvider>
      </PaperProvider>
    </SQLiteProvider>
  );
}
