import Image from "next/image";
import Link from "next/link";

export default function PaketCard({ paket }) {
  return (
    <div className="col-md-3 mb-3">
      <Link href={`/paket/${paket.id}`} className="text-decoration-none">
        <div className="card h-100 text-white bg-dark shadow-sm hover-lift">
          <div
            style={{
              position: "relative",
              height: 200,
            }}
          >
            <Image
              src={paket.gambar || "/default1.jpg"}
              alt={paket.nama}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="card-body d-flex flex-column">
            <h5 className="fw-bold text-danger">{paket.nama}</h5>

            <p className="card-text mb-3">{paket.deskripsi}</p>

            {/* harga selalu di bawah */}
            <div className="mt-auto">
              <span className="fw-bold bg-warning text-dark rounded-pill px-2 py-1">
                Rp {paket.harga.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
