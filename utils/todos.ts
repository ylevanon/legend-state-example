import { observable } from "@legendapp/state";
import { customSynced, generateId, supabase } from "./SupaLegend";

export const todos$ = observable(
    customSynced({
      supabase,
      collection: 'todos',
      select: (from) =>
        from.select('id,counter,text,done,created_at,updated_at,deleted,user_id'),
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
  
//   export function addTodo(text: string) {
//     const id = generateId();
//     todos$[id].assign({
//       id,
//       text,
//       done: false,
//       deleted: false,
//       counter: 0,
//       user_id: supabase.auth.getUser()?.id,
//     });
//   }

export async function addTodo(text: string) {
  const id = generateId();
  const user = await supabase.auth.getUser();
  
  if (!user.data?.user?.id) {
    console.error('No user ID found');
    return;
  }

  const newTodo = {
    id,
    text,
    done: false,
    deleted: false,
    counter: 0,
    user_id: user.data.user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    // First, insert directly into Supabase
    const { error } = await supabase
      .from('todos')
      .insert(newTodo);

    if (error) throw error;

    // If successful, update the local state
    todos$[id].assign(newTodo);
    
    console.log('Added todo:', todos$[id].get());
  } catch (error) {
    console.error('Error adding todo:', error);
  }
}
  
  export function toggleDone(id: string) {
    // Don't toggle if not authenticated
    todos$[id].done.set((prev) => !prev);
  }