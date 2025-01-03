import { migrateIfNeeded } from "@/database/migration";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const CombinedDefaultTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
  },
};

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
  },
};

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
        theme={
          colorScheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme
        }
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
