import { observable } from "@legendapp/state";
import { user$ } from "./Auth";
import { customSynced, generateId, supabase } from "./SupaLegend";

export const todos$ = observable(
    customSynced({
      supabase,
      collection: 'todos',
      select: (from) =>
        from
          .select('id,counter,text,done,created_at,updated_at,deleted,user_id')
          .eq('user_id', user$.get()?.id), // Filter todos by current user
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
  
  export function addTodo(text: string) {
    const userId = user$.get()?.id;
    if (!userId) return; // Don't create todo if not authenticated
  
    const id = generateId();
    todos$[id].assign({
      id,
      text,
      user_id: userId,
      done: false,
      deleted: false,
      counter: 0,
    });
  }
  
  export function toggleDone(id: string) {
    const userId = user$.get()?.id;
    if (!userId) return; // Don't toggle if not authenticated
  
    todos$[id].done.set((prev) => !prev);
  }