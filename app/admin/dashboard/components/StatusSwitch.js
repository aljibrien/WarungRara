export default function StatusSwitch({
  libur,
  setLibur,
  habisSemua,
  setHabisSemua,
  onHideAll,
}) {
  return (
    <div className="row mt-4">
      {/* LIBUR */}
      <div className="col-auto text-center">
        <div className="form-check form-switch d-flex flex-column align-items-center">
          <input
            className={`form-check-input mb-1 ${libur ? "switch-danger" : ""}`}
            type="checkbox"
            role="switch"
            id="liburSwitch"
            checked={libur}
            onChange={(e) => {
              const checked = e.target.checked;
              setLibur(checked);
              if (checked) setHabisSemua(false);
              onHideAll();
            }}
          />
          <label
            className={`form-check-label fw-semibold ${
              libur ? "text-danger" : "text-secondary"
            }`}
            htmlFor="liburSwitch"
          >
            <i className="bi bi-calendar-x me-1"></i>
            Libur
          </label>
        </div>
      </div>

      {/* HABIS */}
      <div className="col-auto text-center">
        <div className="form-check form-switch d-flex flex-column align-items-center">
          <input
            className="form-check-input mb-1"
            type="checkbox"
            role="switch"
            id="habisSwitch"
            checked={habisSemua}
            onChange={(e) => {
              const checked = e.target.checked;
              setHabisSemua(checked);
              if (checked) setLibur(false);
              onHideAll();
            }}
          />
          <label
            className={`form-check-label fw-semibold ${
              habisSemua ? "text-info" : "text-secondary"
            }`}
            htmlFor="habisSwitch"
          >
            <i className="bi bi-emoji-frown me-1"></i>
            Habis
          </label>
        </div>
      </div>
    </div>
  );
}
