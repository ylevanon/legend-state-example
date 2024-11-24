import { Stack } from "expo-router";
import { AppState, SafeAreaView, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import AuthProvider from "@/provider/AuthProvider";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    margin: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderColor: "#999",
    borderRadius: 8,
    borderWidth: 2,
    flex: 0,
    height: 64,
    marginTop: 16,
    padding: 16,
    fontSize: 20,
  },
  todos: {
    flex: 1,
    marginTop: 16,
  },
  todo: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#ffd",
  },
  done: {
    backgroundColor: "#dfd",
  },
  todoText: {
    fontSize: 20,
  },
  clearTodos: {
    margin: 16,
    flex: 0,
    textAlign: "center",
    fontSize: 16,
  },
});
