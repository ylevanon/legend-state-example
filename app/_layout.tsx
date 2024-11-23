import { Stack } from "expo-router";
import { SafeAreaView, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
            },
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
