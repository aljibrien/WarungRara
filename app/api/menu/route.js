// app/api/menu/route.js
'use server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

/* =========================
   UTIL
========================= */
function generateFileName(originalName) {
  const ext = originalName.split('.').pop();
  return `menu_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2)}.${ext}`;
}

/* =========================
   GET MENU + PENGATURAN
========================= */
export async function GET() {
  const { data, error } = await supabase.from('menu').select('*');

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const items = (data ?? []).map(m => ({
    ...m,
    gambar: m.gambar
      ? m.gambar.startsWith('/') 
        ? m.gambar 
        : `/menu/${m.gambar}`
      : '/default1.jpg',
  }));

  const makassarTime = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Makassar' })
  );
  const jam = makassarTime.getHours();

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
    habisSemua: pengaturan?.habisSemua ?? false,
  });
}

/* =========================
   CREATE MENU (POST)
========================= */
export async function POST(request) {
  const formData = await request.formData();

  let gambar = 'default1.jpg'; // default fallback
  const file = formData.get('gambar');

  // ===== TRY SIMPAN FILE KE /public/menu UNTUK LOCALHOST =====
  if (file && file.size > 0) {
    try {
      const fileName = generateFileName(file.name);
      const uploadDir = path.join(process.cwd(), 'public/menu');
      fs.mkdirSync(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      gambar = `/menu/${fileName}`;

    } catch (err) {
      // kalau gagal (misal hosting serverless), tetap pakai default1.png
      console.warn('Gagal simpan file, pakai default:', err.message);
      gambar = 'default1.jpg';
    }
  }

  const payload = {
    nama: formData.get('nama'),
    deskripsi: formData.get('deskripsi'),
    harga: Number(formData.get('harga')),
    tampil: formData.get('tampil') === 'true',
    gambar,
  };

  const { data, error } = await supabase
    .from('menu')
    .insert(payload)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    success: true,
    data, // frontend langsung pakai ini
  });
}

/* =========================
   UPDATE MENU + PENGATURAN
========================= */
export async function PUT(request) {
  const formData = await request.formData();
  const id = formData.get('id');

  if (!id) {
    return Response.json({ error: 'ID menu tidak ditemukan' }, { status: 400 });
  }

  // Ambil data menu lama dulu
  const { data: menuLama, error: fetchError } = await supabase
    .from('menu')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    return Response.json({ error: fetchError.message }, { status: 500 });
  }

  let gambar = menuLama.gambar || '/default1.jpg';
  const file = formData.get('gambar');

  // Kalau ada file baru, simpan & hapus file lama
  if (file && file.size > 0) {
    try {
      const fileName = `menu_${Date.now()}_${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`;
      const uploadDir = path.join(process.cwd(), 'public/menu');
      fs.mkdirSync(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);

      // hapus file lama kalau bukan default
      if (menuLama.gambar && !menuLama.gambar.endsWith('default1.jpg')) {
        const oldFile = path.join(process.cwd(), 'public', menuLama.gambar);
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      }

      gambar = `/menu/${fileName}`;

    } catch (err) {
      console.warn('Gagal simpan file baru, pakai gambar lama:', err.message);
      // tetap pakai gambar lama
    }
  }

  // update record menu di Supabase
  const payload = {
    nama: formData.get('nama'),
    deskripsi: formData.get('deskripsi'),
    harga: Number(formData.get('harga')),
    tampil: formData.get('tampil') === 'true',
    gambar,
  };

  const { data, error } = await supabase
    .from('menu')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true, data });
}

/* ======================
   DELETE MENU
====================== */
export async function DELETE(request) {
  const { id } = await request.json();

  if (!id) {
    return Response.json(
      { error: 'ID menu tidak ditemukan' },
      { status: 400 }
    );
  }

  // 1️⃣ Ambil dulu record menu dari Supabase
  const { data: menuData, error: fetchError } = await supabase
    .from('menu')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    return Response.json(
      { error: fetchError.message },
      { status: 500 }
    );
  }

  // 2️⃣ Hapus file gambar jika bukan default
  if (menuData.gambar && !menuData.gambar.endsWith('default1.jpg')) {
    try {
      const filePath = path.join(process.cwd(), 'public', menuData.gambar);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // hapus file
      }
    } catch (err) {
      console.warn('Gagal hapus file gambar:', err.message);
      // tetap lanjut hapus record
    }
  }

  // 3️⃣ Hapus record menu dari Supabase
  const { error } = await supabase
    .from('menu')
    .delete()
    .eq('id', id);

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json({
    success: true,
    message: '🗑️ Menu berhasil dihapus beserta gambarnya',
  });
}
