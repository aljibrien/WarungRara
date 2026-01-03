export default function MenuToolbar({ searchTerm, setSearchTerm, onTambah }) {
  return (
    <div className="row align-items-end mt-3">
      <div className="col-md-6">
        <input
          className="form-control bg-dark text-white border-secondary"
          placeholder="Cari menu..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="col-md-6 d-flex justify-content-md-end mt-2 mt-md-0">
        <button className="btn btn-primary" onClick={onTambah}>
          <i className="bi bi-plus-circle me-1"></i> Tambah Data
        </button>
      </div>
    </div>
  );
}
