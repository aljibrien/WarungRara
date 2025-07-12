// app/api/auth/check/route.js
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  return Response.json({ loggedIn: !!session.user });
}
