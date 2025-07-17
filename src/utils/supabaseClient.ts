import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

supabase
  .from("bookings")
  .select("*")
  .limit(1)
  .then(({ error }) => {
    if (error) throw error;
    console.log("✅ Supabase connection test successful");
  })
  .catch((error) => {
    console.error("❌ Supabase connection test failed:", error.message);
  });
