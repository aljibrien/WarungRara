'use client';

export function useMenuActions(setMenus) {

  // =========================
  // CREATE MENU
  // =========================
  const createMenu = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    const res = await fetch('/api/menu', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Gagal tambah menu');

    // update state menus
    setMenus(prev => [...prev, result.data]);
    return result.data;
  };

  // =========================
  // EDIT / UPDATE MENU
  // =========================
  const editMenu = async (id, data) => {
    const formData = new FormData();
    formData.append('id', id);

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    const res = await fetch('/api/menu', {
      method: 'PUT',
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Gagal update menu');

    // update state menus
    setMenus(prev =>
      prev.map(m => (m.id === id ? result.data : m))
    );
    return result.data;
  };

  // =========================
  // DELETE MENU
  // =========================
  const deleteMenu = async (id) => {
    const res = await fetch('/api/menu', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Gagal hapus menu');

    // update state menus
    setMenus(prev => prev.filter(m => m.id !== id));
    return result;
  };

  return { createMenu, editMenu, deleteMenu };
}
