import Image from "next/image";
import Link from "next/link";

export default function PaketCard({ paket }) {
  return (
    <div className="col-md-3 mb-3">
      <Link href={`/paket/${paket.id}`} className="text-decoration-none">
        <div className="card bg-dark text-white h-100 shadow-sm">
          <div style={{ height: 200, position: "relative" }}>
            <Image
              src={paket.gambar}
              alt={paket.nama}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="card-body">
            <h5 className="fw-bold text-warning">{paket.nama}</h5>

            <p className="small">{paket.deskripsi}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
