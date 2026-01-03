'use client';
import { useState, useEffect } from 'react';

export function useMenu() {
  const [menus, setMenus] = useState([]);
  const [originalMenus, setOriginalMenus] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenus(data.items ?? []);
        setOriginalMenus(data.items ?? []);
        setLoading(false);
      });
  }, []);

  const handleChangeTampil = (id, value) => {
    setMenus(prev =>
      prev.map(m => (m.id === id ? { ...m, tampil: value } : m))
    );
  };

  const saveChanges = async ({ libur, habisSemua }) => {
    const originalMap = Object.fromEntries(
      originalMenus.map(m => [m.id, m])
    );

    const menuBerubah = menus.filter(m => {
      const o = originalMap[m.id];
      return o && o.tampil !== m.tampil;
    });

    if (menuBerubah.length === 0) {
      throw new Error('NO_CHANGES');
    }

    setIsSaving(true);

    const res = await fetch('/api/menu/simpan-perubahan', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: menuBerubah,
        libur,
        habisSemua,
      }),
    });

    setIsSaving(false);

    if (!res.ok) throw new Error('FAILED');

    setOriginalMenus(menus);
  };

  return {
    menus,
    setMenus,
    loading,
    isSaving,
    handleChangeTampil,
    saveChanges,
  };
}
