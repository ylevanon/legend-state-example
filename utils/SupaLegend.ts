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
    },
  }
);

// Provide a function to generate ids locally
const generateId = () => uuidv4();

// Create a configured sync function
const customSynced = configureSynced(syncedSupabase, {
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

// Add a helper to get the current user's ID
export const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

export const todos$ = observable(
  customSynced({
    supabase,
    collection: 'todos',
    select: (from) =>
      from
        .select('id,counter,text,done,created_at,updated_at,deleted,user_id')
        .eq('user_id', await getCurrentUserId()),  // Filter by current user
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: {
      name: 'todos',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
);

export async function addTodo(text: string) {
  const userId = await getCurrentUserId();
  if (!userId) return; // Don't create todo if user isn't authenticated

  const id = generateId();
  todos$[id].assign({
    id,
    text,
    user_id: userId, // Include the user_id when creating a todo
    done: false,
    counter: 0,
    deleted: false,
  });
}

export function toggleDone(id: string) {
  todos$[id].done.set((prev) => !prev);
}
