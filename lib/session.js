import { getIronSession } from "iron-session";
import { cookies } from "next/headers"; // tetap pakai ini

const sessionOptions = {
  password: process.env.SESSION_PASSWORD, // min 32 karakter
  cookieName: "warung_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// Ubah jadi fungsi yang dipanggil DI DALAM handler
export function getSession() {
  const cookieStore = cookies(); // ini HARUS dipanggil di dalam handler
  return getIronSession(cookieStore, sessionOptions);
}
