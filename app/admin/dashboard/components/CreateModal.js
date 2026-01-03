'use client';

import { useState } from 'react';

export default function MenuCreateModal({
  show,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    tampil: true,
    gambar: null,
  });

  if (!show) return null;

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;

    setForm(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'file'
          ? files[0]
          : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.nama || !form.harga) return;
      try {
        await onSubmit(form);
      } catch (err) {
        return;
      }

      setForm({
        nama: '',
        deskripsi: '',
        harga: '',
        tampil: true,
        gambar: null,
      });
    };


  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-bag-plus-fill"/> Tambah Menu
                </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                <div className="mb-3">
                  <label className="form-label">Nama Menu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Deskripsi</label>
                  <input
                    type="text"
                    className="form-control"
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Harga</label>
                  <input
                    type="number"
                    className="form-control"
                    name="harga"
                    value={form.harga}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Gambar</label>
                  <input
                    type="file"
                    className="form-control"
                    name="gambar"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="tampil"
                    checked={form.tampil}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Tampilkan menu
                  </label>
                </div>

              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                >
                  Simpan
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}
