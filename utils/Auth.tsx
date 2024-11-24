import { AppState } from "react-native";
import { supabase } from "./SupaLegend";
import { observable } from "@legendapp/state";
import { Session, User } from "@supabase/supabase-js";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event

// if the user's session is terminated. This should only be registered once.

export const session$ = observable<Session | null>(null);
export const user$ = observable<User | null>(null);

// Initialize session on load
const initSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    session$.set(session);
    user$.set(session.user);
  }
};

// Call it immediately
initSession();
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

supabase.auth.getSession().then(({ data: { session } }) => {
  session$.set(session);
  user$.set(session?.user ?? null);
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

// Auth state change handler
supabase.auth.onAuthStateChange((_event, session) => {
  session$.set(session);
  user$.set(session?.user ?? null);
});
