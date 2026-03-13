"use client";

import { useState } from "react";
import Image from "next/image";

export default function DetailPaketClient({ paket }) {
  const [dos, setDos] = useState("styrofoam");
  const [qty, setQty] = useState(1);

  const [ayam, setAyam] = useState("Crispy");
  const [sayur, setSayur] = useState("Soup");
  const [telur, setTelur] = useState("Dadar");
  const [lauk, setLauk] = useState("Tempe");

  if (!paket) {
    return (
      <div className="container py-5 text-center">
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
    const lines = [
      "Halo Warung Rara,",
      "Saya mau pesan",
      "-------------",
      paket.nama,
      " ",
      paket.fitur?.ayam && `Ayam : ${ayam}`,
      paket.fitur?.sayur && `Sayur : ${sayur}`,
      paket.fitur?.telur && `Telur : ${telur}`,
      paket.fitur?.tempe && `Gorengan : ${lauk}`,
      "----",
      `Dos : ${dos}`,
      `Jumlah : ${qty}`,
      "----",
      `Total : Rp ${total.toLocaleString("id-ID")}`,
    ].filter(Boolean);

    const pesan = lines.join("\n");

    const url = "https://wa.me/6282192974537?text=" + encodeURIComponent(pesan);

    window.open(url, "_blank");
  };

  const OptionButton = ({ value, current, setValue }) => (
    <button
      className={`btn px-3 py-2 ${
        current === value ? "btn-success text-dark" : "btn-outline-secondary"
      }`}
      onClick={() => setValue(value)}
    >
      {value}
    </button>
  );

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* IMAGE CARD */}
        <div className="col-md-6">
          <div className="card border-0 shadow-lg overflow-hidden">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "420px",
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

          <div className="alert alert-warning small mt-3">
            <strong>Catatan:</strong> Jika ingin memesan paket ini, harap
            melakukan pemesanan <b>minimal 1 hari sebelumnya</b>.
          </div>
        </div>

        {/* DETAIL CARD */}
        <div className="col-md-6">
          <div className="rounded-4 p-4 border border-secondary-subtle">
            <div className="card-body p-4">
              <h3 className="fw-bold text-warning">{paket.nama}</h3>

              <p className="text-secondary mb-3">{paket.deskripsi}</p>

              <div className="mb-4">
                <span className="badge bg-warning text-dark fs-6">
                  Rp {paket.harga.toLocaleString("id-ID")}
                </span>
              </div>

              {/* AYAM */}
              {paket.fitur?.ayam && (
                <div className="mb-4">
                  <label className="fw-semibold mb-2">Jenis Ayam :</label>

                  <div className="d-flex gap-2 flex-wrap">
                    {["Crispy", "Kecap", "Pallekko", "Goreng Rica"].map((i) => (
                      <OptionButton
                        key={i}
                        value={i}
                        current={ayam}
                        setValue={setAyam}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* SAYUR */}
              {paket.fitur?.sayur && (
                <div className="mb-4">
                  <label className="fw-semibold mb-2">Jenis Sayur :</label>

                  <div className="d-flex gap-2 flex-wrap">
                    {[
                      "Soup",
                      "Tumis Labu Siam Campur Laksa",
                      "Tumis Kol",
                      "Urap",
                    ].map((i) => (
                      <OptionButton
                        key={i}
                        value={i}
                        current={sayur}
                        setValue={setSayur}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Telur */}
              {paket.fitur?.telur && (
                <div className="mb-4">
                  <label className="fw-semibold mb-2">Jenis Telur :</label>

                  <div className="d-flex gap-2">
                    {["Dadar", "Mata Sapi", "Rebus"].map((i) => (
                      <OptionButton
                        key={i}
                        value={i}
                        current={telur}
                        setValue={setTelur}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* LAUK */}
              {paket.fitur?.tempe && (
                <div className="mb-4">
                  <label className="fw-semibold mb-2">Jenis Gorengan :</label>

                  <div className="d-flex gap-2">
                    {["Tempe", "Tahu"].map((i) => (
                      <OptionButton
                        key={i}
                        value={i}
                        current={lauk}
                        setValue={setLauk}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* DOS */}
              <div className="mb-4">
                <label className="fw-semibold mb-2">Jenis Dos</label>

                <div className="d-flex gap-2">
                  {["styrofoam", "box"].map((i) => (
                    <OptionButton
                      key={i}
                      value={i}
                      current={dos}
                      setValue={setDos}
                    />
                  ))}
                </div>
              </div>

              {/* QTY */}
              <div className="mb-4">
                <label className="fw-semibold mb-2">Jumlah</label>

                <div
                  className="d-flex align-items-center gap-2"
                  style={{ maxWidth: 180 }}
                >
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-control text-center"
                    style={{ width: "70px" }}
                    value={qty}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");

                      if (val === "") {
                        setQty("");
                        return;
                      }

                      setQty(Math.max(1, Number(val)));
                    }}
                  />

                  <button
                    className="btn btn-outline-light"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* TOTAL */}
              <div className="alert alert-light border d-flex justify-content-between align-items-center">
                <strong>Total</strong>

                <span className="fs-5 fw-bold text-success">
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>

              {/* BUTTON */}
              <button
                className="btn btn-success w-100 py-3 fw-semibold"
                onClick={pesanWA}
              >
                Pesan via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
