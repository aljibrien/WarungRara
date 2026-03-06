"use server";
import { supabase } from "@/lib/supabase";

/* ======================
   GET PENGATURAN WARUNG
====================== */
export async function GET() {
  const { data, error } = await supabase
    .from("pengaturan")
    .select("libur, habisSemua, updated_at")
    .eq("id", 1)
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    libur: data.libur,
    habisSemua: data.habisSemua,
    updated_at: data.updated_at,
  });
}
