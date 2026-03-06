"use client";

import { useState } from "react";
import Image from "next/image";

export default function DetailPaketClient({ paket }) {
  const [dos, setDos] = useState("styrofoam");
  const [qty, setQty] = useState(1);

  if (!paket) {
    return (
      <div className="container py-5">
        <h3>Paket tidak ditemukan</h3>
      </div>
    );
  }

  const hargaDos = {
    styrofoam: 0,
    box: 0,
  };

  const total = (paket.harga + hargaDos[dos]) * qty;

  const pesanWA = () => {
    const pesan = `
Halo Warung Rara

Saya mau pesan:

${paket.nama}
Isi: ${paket.deskripsi}

Jenis dos: ${dos}
Jumlah: ${qty}

Total: Rp ${total.toLocaleString("id-ID")}
`;

    const url = "https://wa.me/6282192974537?text=" + encodeURIComponent(pesan);

    window.open(url, "_blank");
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center g-4">
        {/* gambar */}
        <div className="col-md-6">
          <div className="card border-0 shadow-lg">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "380px",
              }}
            >
              <Image
                src={paket.gambar || "/default1.jpg"}
                alt={paket.nama}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>

        {/* detail */}
        <div className="col-md-6">
          <h2 className="fw-bold mb-2 text-warning">{paket.nama}</h2>

          <p className="text-secondary mb-3">{paket.deskripsi}</p>

          <div className="mb-3">
            <span className="badge bg-warning text-dark fs-6 px-3 py-2">
              Rp {paket.harga.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="mb-3">
            <label className="fw-semibold mb-1">Pilih Jenis Dos</label>

            <select
              className="form-select"
              value={dos}
              onChange={(e) => setDos(e.target.value)}
            >
              <option value="styrofoam">Styrofoam</option>

              <option value="box">Box Karton</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="fw-semibold mb-1">Jumlah Pesanan</label>

            <input
              type="number"
              className="form-control"
              min={1}
              value={qty}
              onChange={(e) => {
                const val = e.target.value;

                if (val === "") {
                  setQty("");
                  return;
                }

                setQty(Math.max(1, Number(val)));
              }}
            />
          </div>

          <h4 className="text-success mb-3">
            Total: Rp {total.toLocaleString("id-ID")}
          </h4>

          <button className="btn btn-success px-4 py-2" onClick={pesanWA}>
            Pesan via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
