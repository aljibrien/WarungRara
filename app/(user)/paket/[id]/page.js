import { paketMenu } from "../../../../data/paket";
import DetailPaketClient from "./DetailPaketClient";

export default async function Page({ params }) {
  const { id } = await params;

  const paket = paketMenu.find((p) => p.id === id);

  return <DetailPaketClient paket={paket} />;
}
