import { useAuth } from "@/provider/AuthProvider";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, isLoading } = useAuth();

  console.log("Index - User State:", user);
  console.log("Index - Loading State:", isLoading);

  if (isLoading) {
    return null;
  }

  if (user !== null) {
    console.log("Redirecting to protected route");
    return <Redirect href="/todo" />;
  }

  console.log("Redirecting to auth route");
  return <Redirect href="/login" />;
}
