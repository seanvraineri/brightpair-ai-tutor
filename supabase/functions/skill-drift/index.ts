/// <reference lib="deno.ns" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0?dts";

// Invoked on a schedule (e.g., daily at midnight)
Deno.serve(async (_req) => {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Call the mastery decay function
    await supabase.rpc('decay_mastery');
    
    console.log("Skill mastery decay process completed successfully");
    
    return new Response(
      JSON.stringify({ success: true, message: "Skill mastery decay complete" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in skill mastery decay:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}); 