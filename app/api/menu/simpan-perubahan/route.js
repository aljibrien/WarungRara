'use server';
import { supabase } from '@/lib/supabase';

export async function PUT(request) {
  try {
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return Response.json(
        { error: 'Content-Type harus application/json' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { items, libur = false, habisSemua = false } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'Tidak ada menu untuk diupdate' }, { status: 400 });
    }

    // Update setiap menu tampil
    for (const m of items) {
      const { id, tampil } = m;
      if (!id) continue;

      const { error } = await supabase
        .from('menu')
        .update({ tampil })
        .eq('id', id);

      if (error) {
        console.warn('Gagal update menu ID', id, error.message);
      }
    }

    // Update pengaturan libur & habisSemua + updated_at
    const { error: pengaturanError } = await supabase
        .from('pengaturan')
        .update({
            libur,
            habisSemua,
            updated_at: new Date().toISOString() // ✅ set updated_at manual
        })
        .eq('id', 1);


    if (pengaturanError) {
      return Response.json({ error: pengaturanError.message }, { status: 500 });
    }

    return Response.json({ success: true });

  } catch (err) {
    return Response.json({ error: err.message || 'PUT massal gagal' }, { status: 500 });
  }
}
