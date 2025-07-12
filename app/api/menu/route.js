// app/api/menu/route.js
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('menu') // pastikan ini nama tabel benar persis
    .select('*');

  console.log("📦 DATA:", data);
  console.log("❌ ERROR:", error);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    items: data ?? [],
    updatedAt: new Date().toISOString(),
  });
}



export async function PUT(request) {
  const { items } = await request.json();

  const updates = items.map(item =>
    supabase
      .from('menu')
      .update({ tampil: item.tampil })
      .eq('id', item.id)
  );

  const results = await Promise.allSettled(updates);

  const hasError = results.some(r => r.status === 'rejected');

  if (hasError) {
    return Response.json({ error: 'Gagal memperbarui data' }, { status: 500 });
  }

  return Response.json({ success: true });
}
