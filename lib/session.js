import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

const sessionOptions = {
  password: process.env.SESSION_PASSWORD,
  cookieName: "warung_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// ✅ Ubah jadi async function dan await cookies()
export async function getSession() {
  const cookieStore = await cookies(); // ✅ pakai await
  return getIronSession(cookieStore, sessionOptions);
}
