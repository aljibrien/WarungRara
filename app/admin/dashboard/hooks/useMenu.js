"use client";
import { useState, useEffect, useMemo } from "react";

export function useMenu() {
  const [menus, setMenus] = useState([]);
  const [originalMenus, setOriginalMenus] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setMenus(data.items ?? []);
        setOriginalMenus(data.items ?? []);
        setLoading(false);
      });
  }, []);

  const handleChangeTampil = (id, value) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, tampil: value } : m)),
    );
  };

  const hasMenuChanges = useMemo(() => {
    const originalMap = Object.fromEntries(
      originalMenus.map((m) => [m.id, m.tampil]),
    );

    return menus.some((m) => originalMap[m.id] !== m.tampil);
  }, [menus, originalMenus]);

  const saveChanges = async ({ libur, habisSemua }) => {
    const originalMap = Object.fromEntries(originalMenus.map((m) => [m.id, m]));

    const menuBerubah = menus.filter((m) => {
      const o = originalMap[m.id];
      return o && o.tampil !== m.tampil;
    });

    setIsSaving(true);

    try {
      const res = await fetch("/api/menu/simpan-perubahan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: menuBerubah, // boleh kosong
          libur,
          habisSemua,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "FAILED");
      }

      // 🔁 update snapshot menu SETELAH sukses
      setOriginalMenus(menus);
    } finally {
      // 🔒 WAJIB: agar state nggak nyangkut
      setIsSaving(false);
    }
  };

  return {
    menus,
    setMenus,
    loading,
    isSaving,
    handleChangeTampil,
    saveChanges,
    hasMenuChanges, // 👈 PENTING
  };
}
