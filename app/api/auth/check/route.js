import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession(); // ✅ pastikan pakai await

  if (session.user) {
    return Response.json({ loggedIn: true });
  } else {
    return Response.json({ loggedIn: false });
  }
}
