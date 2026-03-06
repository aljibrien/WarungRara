"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMenu } from "./hooks/useMenu";
import MenuToolbar from "./components/MenuToolbar";
import MenuTable from "./components/MenuTable";
import StatusSwitch from "./components/StatusSwitch";
import Pagination from "./components/Pagination";
import MenuCreateModal from "./components/CreateModal";
import MenuEditModal from "./components/EditModal";
import DeleteModal from "./components/DeleteModal";
import { useMenuActions } from "./hooks/useMenuActions";

export default function AdminDashboard() {
  const router = useRouter();
  useEffect(() => {
    fetch("/api/auth/check").then((res) => {
      if (!res.ok) router.replace("/admin/login");
    });
  }, []);

  const sudahResetHariIniRef = useRef(false);

  useEffect(() => {
    const tick = async () => {
      const wita = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Makassar" }),
      );

      const jam = wita.getHours();
      const menit = wita.getMinutes();

      // reset sekali per hari setelah tepat jam 17:00
      if (jam === 17 && menit === 0 && !sudahResetHariIniRef.current) {
        sudahResetHariIniRef.current = true;

        await fetch("/api/menu/reset-habis", { method: "POST" });
        setHabisSemua(false); // ✅ reset state UI
      }

      // besoknya boleh reset lagi
      if (jam === 0 && menit === 1) {
        sudahResetHariIniRef.current = false;
      }
    };

    tick();
    const id = setInterval(tick, 30_000); // cek tiap 30 detik
    return () => clearInterval(id);
  }, []);

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    menus,
    setMenus,
    loading,
    handleChangeTampil,
    saveChanges,
    isSaving,
    hasMenuChanges,
  } = useMenu();
  const { createMenu, deleteMenu, editMenu } = useMenuActions(setMenus);
  const [searchTerm, setSearchTerm] = useState("");
  const [libur, setLibur] = useState(false);
  const [habisSemua, setHabisSemua] = useState(false);
  const [showModal, setShowModal] = useState({
    show: false,
    message: "",
    type: "", // atau 'info', 'error', dll
  });
  const [initialPengaturan, setInitialPengaturan] = useState({
    libur: false,
    habisSemua: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const onHideAll = () => {
    setMenus((prev) => prev.map((m) => ({ ...m, tampil: false })));
  };

  useEffect(() => {
    const fetchPengaturan = async () => {
      try {
        const res = await fetch("/api/pengaturan");
        const data = await res.json();

        setLibur(data.libur);
        setHabisSemua(data.habisSemua);

        setInitialPengaturan({
          libur: data.libur,
          habisSemua: data.habisSemua,
        });
      } catch (err) {
        console.error("Gagal ambil pengaturan:", err);
      }
    };

    fetchPengaturan();
  }, []);

  const handleSave = async () => {
    const pengaturanChanged =
      initialPengaturan.libur !== libur ||
      initialPengaturan.habisSemua !== habisSemua;

    // 🟡 TIDAK ADA PERUBAHAN → JANGAN HIT API
    if (!hasMenuChanges && !pengaturanChanged) {
      setShowModal({
        show: true,
        message: "ℹ️ Tidak ada perubahan data, status tetap sinkron",
        type: "secondary",
      });

      setTimeout(() => {
        setShowModal({ show: false, message: "", type: "" });
      }, 2000);

      return;
    }

    // 🟢 ADA PERUBAHAN → BARU HIT API
    try {
      await saveChanges({ libur, habisSemua });

      // update snapshot pengaturan
      setInitialPengaturan({ libur, habisSemua });

      setShowModal({
        show: true,
        message: "✅ Perubahan berhasil disimpan",
        type: "success",
      });
    } catch (err) {
      setShowModal({
        show: true,
        message: "❌ Gagal menyimpan perubahan",
        type: "danger",
      });
    }

    setTimeout(() => {
      setShowModal({ show: false, message: "", type: "" });
    }, 2000);
  };

  if (loading) return <p className="p-4">Loading...</p>;

  const filteredMenus = menus.filter((m) =>
    m.nama.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

  const currentMenus = filteredMenus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="container py-4">
      <h3>Dashboard Admin</h3>

      <StatusSwitch
        libur={libur}
        setLibur={setLibur}
        habisSemua={habisSemua}
        setHabisSemua={setHabisSemua}
        onHideAll={onHideAll}
      />

      <MenuToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onTambah={() => setShowCreateModal(true)}
      />

      <MenuTable
        menus={currentMenus}
        onEdit={(menu) => {
          setSelectedMenu(menu);
          setShowEditModal(true);
        }}
        onDelete={(menu) => {
          setSelectedMenu(menu);
          setShowDeleteModal(true);
        }}
        onChangeTampil={handleChangeTampil}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <div className="d-flex gap-2 mt-4">
        <button
          className="btn btn-success"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => router.push("/")}
        >
          ← Kembali
        </button>
      </div>

      <MenuCreateModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={async (data) => {
          try {
            await createMenu(data);
            setShowCreateModal(false);
            setShowModal({
              show: true,
              message: "✅ Menu Berhasil Ditambahkan",
              type: "success",
            });
          } catch (err) {
            setShowModal({
              show: true,
              message: err.message || "❌ Gagal Menambahkan Menu",
              type: "danger",
            });
          } finally {
            setTimeout(() => {
              setShowModal({ show: false, message: "", type: "" });
            }, 3000);
          }
        }}
      />

      <MenuEditModal
        show={showEditModal}
        menu={selectedMenu}
        onClose={() => setShowEditModal(false)}
        onSubmit={async (data) => {
          if (!selectedMenu) return;

          try {
            await editMenu(selectedMenu.id, data);
            setShowEditModal(false);

            setShowModal({
              show: true,
              message: "✅ Menu berhasil diupdate",
              type: "success",
            });
          } catch (err) {
            setShowModal({
              show: true,
              message: err.message || "❌ Gagal update menu",
              type: "danger",
            });
          } finally {
            setTimeout(
              () => setShowModal({ show: false, message: "", type: "" }),
              3000,
            );
          }
        }}
      />

      <DeleteModal
        show={showDeleteModal}
        menu={selectedMenu}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async (id) => {
          try {
            await deleteMenu(id);

            setShowDeleteModal(false);

            setShowModal({
              show: true,
              message: "🗑️ Menu berhasil dihapus",
              type: "success",
            });
          } catch (err) {
            setShowModal({
              show: true,
              message: "❌ Gagal menghapus menu",
              type: "danger",
            });
          } finally {
            setTimeout(
              () => setShowModal({ show: false, message: "", type: "" }),
              3000,
            );
          }
        }}
      />

      {showModal.show && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className={`modal-content bg-${showModal.type} text-white`}>
                <div className="modal-body text-center py-4">
                  <h5 className="mb-0">{showModal.message}</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
