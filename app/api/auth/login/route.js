import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const user = users.find(u => u.username === username);
    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json({ error: "Password salah" }, { status: 401 });
    }

    // PANGGIL getSession() di sini — DI DALAM handler
    const session = await getSession();
    session.user = { username };
    await session.save();

    return Response.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    return Response.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
