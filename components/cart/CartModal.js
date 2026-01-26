"use client";
import { useCart } from "../../context/CartContext";

export default function CartModal({ onCheckout, onClose }) {
  const { cart, updateQty, removeItem, total } = useCart();

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
            <h5 className="modal-title">
              <i className="bi bi-cart4" /> Keranjang Belanja
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>

          {/* BODY */}
          <div
            className="modal-body"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            {cart.length === 0 ? (
              <div className="text-center text-muted py-5">
                <div style={{ fontSize: 40 }}>🛍️</div>
                <p className="mt-2 mb-0">Keranjang masih kosong</p>
                <small>Silakan pilih menu dulu</small>
              </div>
            ) : (
              cart.map((i) => (
                <div
                  key={i.id}
                  className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3 bg-secondary bg-opacity-25"
                >
                  {/* INFO */}
                  <div>
                    <div className="fw-semibold">{i.nama}</div>
                    <small className="text-warning">
                      Rp {(i.harga * i.qty).toLocaleString("id-ID")}
                    </small>
                  </div>

                  {/* QTY CONTROL */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 28, height: 28 }}
                      onClick={() => updateQty(i.id, i.qty - 1)}
                    >
                      <i className="bi bi-dash-lg" />
                    </button>

                    <span className="fw-bold">{i.qty}</span>

                    <button
                      className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 28, height: 28 }}
                      onClick={() => updateQty(i.id, i.qty + 1)}
                    >
                      <i className="bi bi-plus-lg" />
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center ms-2"
                      style={{ width: 28, height: 28 }}
                      onClick={() => removeItem(i.id)}
                      title="Hapus"
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          <div className="modal-footer border-secondary d-flex flex-column gap-2">
            <div className="w-100 d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Total</span>
              <span className="fw-bold text-warning fs-5">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="w-100 d-flex gap-2">
              <button
                className="btn btn-outline-light w-50 rounded-pill"
                onClick={onClose}
              >
                Tutup
              </button>

              <button
                className="btn btn-success w-50 rounded-pill"
                onClick={onCheckout}
                // disabled={cart.length === 0}
                disabled
              >
                Checkout
                <div>
                  <small className="text-warning">
                    Tidak tersedia untuk saat ini
                  </small>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
