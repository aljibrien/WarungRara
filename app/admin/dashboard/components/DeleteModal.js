'use client';

export default function DeleteModal({ show, menu, onClose, onConfirm }) {
  if (!show || !menu) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Hapus Menu</h5>
            </div>

            <div className="modal-body">
              <p>
                Yakin ingin menghapus menu <b>"{menu.nama}"</b>?
              </p>
              <small className="text-danger">
                Tindakan ini tidak dapat dibatalkan.
              </small>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Batal
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onConfirm(menu.id)}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}
