import { observable } from '@legendapp/state';
import { customSynced } from '@/utils/supabase.config';
import { supabase } from '@/utils/supabase';
import type { TodoCreate } from './todos.types';

export const todos$ = observable(
  customSynced({
    collection: 'todos',
    select: (from) =>
      from
        .select('id,counter,text,done,created_at,updated_at,deleted,user_id')
        .eq('user_id', supabase.auth.session()?.user?.id),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: {
      name: 'todos',
      retrySync: true,
    },
  })
);

export const addTodo = (text: string) => {
  const userId = supabase.auth.session()?.user?.id;
  if (!userId) return;

  const id = uuidv4();
  todos$[id].assign({
    id,
    text,
    user_id: userId,
    done: false,
    deleted: false,
    counter: 0,
  });
};

export const toggleTodo = (id: string) => {
  const userId = supabase.auth.session()?.user?.id;
  if (!userId) return;

  todos$[id].done.set((prev) => !prev);
};