import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (session && session.user) {
    return Response.json({ loggedIn: true });
  }

  return Response.json({ loggedIn: false }, { status: 401 });
}

