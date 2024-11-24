// import { observable } from "@legendapp/state";
// import { Session, User } from "@supabase/supabase-js";
// import { supabase } from "./SupaLegend";

// // Tells Supabase Auth to continuously refresh the session automatically if
// // the app is in the foreground. When this is added, you will continue to receive
// // `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event

// // if the user's session is terminated. This should only be registered once.

// export const session$ = observable<Session | null>(null);
// export const user$ = observable<User | null>(null);

// // Auth state change handler
// supabase.auth.onAuthStateChange((_event, session) => {
//     session$.set(session);
//     user$.set(session?.user ?? null);
//   });

//   supabase.auth.getSession().then(({ data: { session } }) => {
//     session$.set(session);
//     user$.set(session?.user ?? null);
//   });