import { AppState } from "react-native";
import { supabase } from "./SupaLegend";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Auth functions
export const signInWithEmail = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { error };
};

export const signUpWithEmail = async (email: string, password: string) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });
  return { session, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
