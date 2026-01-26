"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { haversineDistance, hitungOngkir } from "../../lib/distance";

export default function CheckoutModal({ onClose }) {
  const { cart, total, clearCart } = useCart();

  // SNAPSHOT cart (biar aman pas clearCart)
  const [checkoutItems] = useState(cart);

  const [deliveryType, setDeliveryType] = useState("ambil"); // ambil | antar
  const [paymentType, setPaymentType] = useState("cod"); // cod | transfer
  const [customerLoc, setCustomerLoc] = useState(null);
  const [jarak, setJarak] = useState(0);
  const [ongkir, setOngkir] = useState(0);

  const WARUNG_LOCATION = {
    lat: -5.1662204,
    lng: 119.474828,
  };

  useEffect(() => {
    if (deliveryType !== "antar" || !customerLoc) return;

    const j = haversineDistance(
      WARUNG_LOCATION.lat,
      WARUNG_LOCATION.lng,
      customerLoc.lat,
      customerLoc.lng,
    );

    setJarak(j);
    setOngkir(hitungOngkir(j));
  }, [deliveryType, customerLoc]);

  const pesanWA = encodeURIComponent(`
Halo Warung Rara
Saya mau pesan:

${checkoutItems
  .map((i) => `- ${i.nama} x${i.qty} = Rp ${i.harga * i.qty}`)
  .join("\n")}

Pengambilan: ${deliveryType === "antar" ? "Di Antar" : "Ambil di Tempat"}
Pembayaran: ${paymentType === "cod" ? "COD" : "Transfer / QRIS"}

${
  deliveryType === "antar"
    ? `Jarak: ${jarak.toFixed(2)} km
Ongkir: Rp ${ongkir}`
    : ""
}

Total: Rp ${total + ongkir}
`);

  const handleSendWA = () => {
    window.open(`https://wa.me/628962680034?text=${pesanWA}`, "_blank");
    clearCart();
  };

  return (
    <div
      className="modal fade show d-block bg-dark bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-dark text-white rounded-4 shadow-lg">
          {/* HEADER */}
          <div className="modal-header border-secondary">
            <h5 className="modal-title">🧾 Checkout</h5>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>

          {/* BODY */}
          <div
            className="modal-body"
            style={{ maxHeight: "65vh", overflowY: "auto" }}
          >
            {/* PENGAMBILAN */}
            <div className="mb-4 p-3 rounded-3 bg-secondary bg-opacity-25">
              <p className="fw-bold mb-2">Pengambilan</p>
              <div className="d-flex gap-2">
                <button
                  className={`btn w-50 ${
                    deliveryType === "ambil"
                      ? "btn-warning"
                      : "btn-outline-warning"
                  }`}
                  onClick={() => setDeliveryType("ambil")}
                >
                  <i className="bi bi-person-walking"></i> Ambil di Tempat
                </button>

                <button
                  className={`btn w-50 ${
                    deliveryType === "antar"
                      ? "btn-warning"
                      : "btn-outline-warning"
                  }`}
                  onClick={() => setDeliveryType("antar")}
                >
                  <i className="bi bi-scooter"></i> Di Antars
                </button>
              </div>

              {deliveryType === "antar" && (
                <div className="mt-3">
                  <button
                    className="btn btn-outline-info w-100 mb-2"
                    onClick={() =>
                      navigator.geolocation.getCurrentPosition((pos) =>
                        setCustomerLoc({
                          lat: pos.coords.latitude,
                          lng: pos.coords.longitude,
                        }),
                      )
                    }
                  >
                    <i className="bi bi-geo-alt"></i> Gunakan Lokasi Saya
                  </button>

                  {customerLoc && (
                    <small className="text-info">
                      Jarak: {jarak.toFixed(2)} km • Ongkir: Rp{" "}
                      {ongkir.toLocaleString("id-ID")}
                    </small>
                  )}
                </div>
              )}
            </div>

            {/* PEMBAYARAN */}
            <div className="mb-4 p-3 rounded-3 bg-secondary bg-opacity-25">
              <p className="fw-bold mb-2">Pembayaran</p>
              <div className="d-flex gap-2">
                <button
                  className={`btn w-50 ${
                    paymentType === "cod"
                      ? "btn-success"
                      : "btn-outline-success"
                  }`}
                  onClick={() => setPaymentType("cod")}
                >
                  COD
                </button>

                <button
                  className={`btn w-50 ${
                    paymentType === "transfer"
                      ? "btn-success"
                      : "btn-outline-success"
                  }`}
                  onClick={() => setPaymentType("transfer")}
                >
                  Transfer / QRIS
                </button>
              </div>
            </div>

            {/* RINGKASAN */}
            <div className="p-3 rounded-3 bg-secondary bg-opacity-25">
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>

              {deliveryType === "antar" && (
                <div className="d-flex justify-content-between">
                  <span>Ongkir</span>
                  <span>Rp {ongkir.toLocaleString("id-ID")}</span>
                </div>
              )}

              <hr className="border-secondary" />

              <div className="d-flex justify-content-between fw-bold fs-5 text-warning">
                <span>Total</span>
                <span>Rp {(total + ongkir).toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer border-secondary">
            <button
              className="btn btn-success w-100 rounded-pill"
              onClick={handleSendWA}
              disabled={checkoutItems.length === 0}
            >
              <i className="bi bi-whatsapp me-2"></i>
              Pesan via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
