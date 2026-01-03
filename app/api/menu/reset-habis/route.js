// app/api/menu/reset-habis/route.js
import { supabase } from '@/lib/supabase';

export async function POST() {
  // waktu Makassar
  const makassarTime = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Makassar' })
  );
  const jam = makassarTime.getHours();

  if (jam < 17) {
    return Response.json({
      message: 'Belum waktu reset',
      jam,
    });
  }

  // ambil status sekarang
  const { data: pengaturan, error } = await supabase
    .from('pengaturan')
    .select('habisSemua')
    .eq('id', 1)
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // jika sudah false, tidak perlu reset
  if (!pengaturan.habisSemua) {
    return Response.json({
      message: 'Status sudah normal, tidak perlu reset',
    });
  }

  // reset habisSemua
  const { error: updateError } = await supabase
    .from('pengaturan')
    .update({
      habisSemua: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1);

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  return Response.json({
    success: true,
    message: '✅ Status habis berhasil di-reset otomatis',
  });
}
