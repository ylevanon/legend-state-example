import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { observable } from '@legendapp/state';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { configureSynced } from '@legendapp/state/sync';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,{
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storageKey: 'supabase.auth.token',
    },
  }
);

// export const session$ = observable<any>(null);
// export const user$ = observable<any>(null);

// supabase.auth.getSession().then(({ data: { session } }) => {
//   session$.set(session);
//   user$.set(session?.user ?? null);
// });

// // Auth functions
// export const signInWithEmail = async (email: string, password: string) => {
//   const { error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });
//   return { error };
// };

// export const signUpWithEmail = async (email: string, password: string) => {
//   const { data: { session }, error } = await supabase.auth.signUp({
//     email,
//     password,
//   });
//   return { session, error };
// };

// export const signOut = async () => {
//   const { error } = await supabase.auth.signOut();
//   return { error };
// };


// // Auth state change handler
// supabase.auth.onAuthStateChange((_event, session) => {
//   session$.set(session);
//   user$.set(session?.user ?? null);
// });

// Provide a function to generate ids locally
export const generateId = () => uuidv4();

// Create a configured sync function
export const customSynced = configureSynced(syncedSupabase, {
  // Use React Native Async Storage
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  // Optionally enable soft deletes
  fieldDeleted: 'deleted',
});

