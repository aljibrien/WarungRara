// app/api/menu/route.js
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('menu')
    .select('*');

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const { data: pengaturan, error: err2 } = await supabase
    .from('pengaturan')
    .select('updated_at, libur, habisSemua') // tambahkan habisSemua
    .eq('id', 1)
    .single();

  if (err2) {
    return Response.json({ error: err2.message }, { status: 500 });
  }

  return Response.json({
    items: data ?? [],
    updatedAt: pengaturan?.updated_at ?? null,
    libur: pengaturan?.libur ?? false,
    habisSemua: pengaturan?.habisSemua ?? false, // kirim ke frontend
  });
}

export async function PUT(request) {
  const { items, libur, habisSemua } = await request.json(); // terima habisSemua dari admin

  const results = [];

  for (const item of items) {
    const { data, error } = await supabase
      .from('menu')
      .update({ tampil: item.tampil })
      .eq('id', item.id)
      .select();

    results.push({ id: item.id, data, error });
  }

  const hasError = results.some(r => r.error);

  if (hasError) {
    return Response.json({ error: 'Gagal memperbarui data' }, { status: 500 });
  }

  const { error: updatePengaturanError } = await supabase
    .from('pengaturan')
    .update({
      updated_at: new Date().toISOString(),
      libur,
      habisSemua,
    })
    .eq('id', 1);

  if (updatePengaturanError) {
    return Response.json({ error: updatePengaturanError.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
