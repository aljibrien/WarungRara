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

  console.log("🔄 DITERIMA UNTUK UPDATE:", items);

  const results = [];

  for (const item of items) {
    console.log(`📝 Update item id=${item.id}, tampil=${item.tampil}`);

    const { data, error } = await supabase
      .from('menu')
      .update({ tampil: item.tampil })
      .eq('id', item.id)
      .select(); // pakai select biar kelihatan hasilnya

    console.log("📤 Response update:", { data, error });

    results.push({ id: item.id, data, error });
  }

  const hasError = results.some(r => r.error);

  if (hasError) {
    console.error("❌ Ada error saat update:", results);
    return Response.json({ error: 'Gagal memperbarui data' }, { status: 500 });
  }

  return Response.json({ success: true });
}