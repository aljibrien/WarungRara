import Image from 'next/image';

export default function MenuTable({ menus, onEdit, onDelete, onChangeTampil }) {
  return (
    <div className="scroll-x">
      <table className="table table-bordered mt-4">
        <thead className="table-primary">
          <tr>
            <th className="text-center">Tampikan</th>
            <th className="text-center">Nama</th>
            <th className="text-center">Deskripsi</th>
            <th className="text-center">Harga</th>
            <th className="text-center">Gambar</th>
            <th className="text-center">Aksi</th>
          </tr>
        </thead>

        <tbody className="table-dark">
          {menus.map(menu => {
            

            const imgSrc = menu.gambar && menu.gambar.startsWith('/')
              ? menu.gambar
              : '/default1.jpg';

            return (
              <tr key={menu.id}>
                <td>
                  <select
                    className="form-select"
                    value={menu.tampil ? 'true' : 'false'}
                    onChange={e =>
                      onChangeTampil(menu.id, e.target.value === 'true')
                    }
                  >
                    <option value="true">Ya</option>
                    <option value="false">Tidak</option>
                  </select>
                </td>

                <td>{menu.nama}</td>
                <td>{menu.deskripsi}</td>
                <td>Rp {menu.harga.toLocaleString('id-ID')}</td>

                <td className="text-center">
                  <Image
                    src={imgSrc}
                    width={60}
                    height={60}
                    alt={menu.nama || 'Menu'}
                  />
                </td>

                <td className="text-center">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => onEdit(menu)}
                  >
                    ✏️
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(menu)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
