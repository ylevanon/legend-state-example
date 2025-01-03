import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "@/utils/SupaLegend";
import { todos$ } from "@/utils/todos"; // Import your todos observable

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; session: Session | null }>;
  signOut: () => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null, session: null }),
  signOut: async () => ({ error: null }),
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        // Trigger a refresh of the todos after successful login
        const { data: todos } = await supabase
          .from("todos")
          .select("*")
          .order("created_at", { ascending: false });

        if (todos) {
          // Convert array to object with ID as key
          const todosObject = todos.reduce((acc, todo) => {
            acc[todo.id] = todo;
            return acc;
          }, {});

          todos$.set(todosObject);
        }
      }

      return { error };
    } catch (error) {
      console.error("Error in signInWithEmail:", error);
      return { error: error as Error };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({ email, password });
    return { error, session: data.session };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear the session
      setSession(null);
      setIsLoading(false);

      // Only reset the observable state, don't clear AsyncStorage
      todos$.set({});

      return { error: null };
    } catch (error) {
      console.error("Error in signOut:", error);
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
