import { useState, useEffect } from 'react';
import Modal from './Modal';

// Jednoduchá validace URL – zkontroluje jen formát textu (znaky a struktura)
const isValidUrl = (value) => {
  const trimmed = value.trim();
  // Musí začínat http:// nebo https://, pak alespoň jeden znak, tečka a ještě alespoň 2 znaky
  const urlPattern = /^https?:\/\/[\w\-]+(\.[\w\-]+)+([\/\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i;
  return urlPattern.test(trimmed);
};

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', message: '', id: null });
  const [editForm, setEditForm] = useState({ name: '', url: '' });

  const closeModal = () => setModal({ isOpen: false, type: '', title: '', message: '', id: null });

  // Načtení všech obchodů z backendu metodou GET (výchozí)
  const loadShops = () => {
    fetch('http://localhost:3000/shop')
      .then(res => res.json())
      .then(data => setShops(data));
  };

  useEffect(() => { loadShops(); }, []);

  const addShop = (e) => {
    e.preventDefault();

    if (!isValidUrl(url)) {
      setModal({ isOpen: true, type: 'alert', title: 'Neplatná URL', message: 'Zadejte platnou webovou adresu začínající http:// nebo https://, například https://www.example.cz', id: null });
      return;
    }

    const isDuplicate = shops.some(s =>
      s.name.toLowerCase().trim() === name.toLowerCase().trim() ||
      s.url.toLowerCase().trim() === url.toLowerCase().trim()
    );

    if (isDuplicate) {
      setModal({ isOpen: true, type: 'alert', title: 'Chyba', message: 'Tento obchod nebo URL již v databázi existuje!', id: null });
      return;
    }

    fetch('http://localhost:3000/shop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, url })
    }).then(() => {
      setName(''); setUrl(''); loadShops();
      setModal({ isOpen: true, type: 'alert', title: 'Úspěch', message: 'Obchod úspěšně přidán!', id: null });
    });
  };

  const openEdit = (shop) => {
    setEditForm({ name: shop.name, url: shop.url });
    setModal({ isOpen: true, type: 'edit', title: 'Upravit obchod', message: '', id: shop.id });
  };

  const executeEdit = () => {
    if (editForm.name.trim() === '' || editForm.url.trim() === '') return;

    if (!isValidUrl(editForm.url)) {
      setModal(prev => ({ ...prev, isOpen: true, type: 'alert', title: 'Neplatná URL', message: 'Zadejte platnou webovou adresu začínající http:// nebo https://, například https://www.example.cz' }));
      return;
    }

    fetch('http://localhost:3000/shop/' + modal.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editForm.name, url: editForm.url })
    }).then(() => {
      loadShops();
      closeModal();
    });
  };

  const openDelete = (shop) => {
    setModal({ isOpen: true, type: 'delete', title: 'Smazat obchod', message: 'Opravdu si přejete smazat tento obchod?', id: shop.id });
  };

  const executeDelete = () => {
    fetch('http://localhost:3000/shop/' + modal.id, { method: 'DELETE' })
      .then(() => {
        loadShops();
        closeModal();
      });
  };

  return (
    <div>
      <div className="card-container" style={{ marginTop: '40px' }}>
        <h2>Přidat nový e-shop</h2>
        <p className="subtitle">Zaregistrujte nový obchod pro sledování cen.</p>

        <form onSubmit={addShop}>
          <div className="form-group">
            <label>Název e-shopu</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="např. Alza.cz" required />
          </div>
          <div className="form-group">
            <label>Webová adresa (URL)</label>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.example.cz" required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>Přidat obchod</button>
        </form>
      </div>

      {shops.length > 0 && (
        <div className="form-section">
          <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Spravovat existující obchody</h3>
          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {shops.map(shop => (
              <div key={shop.id} className="product-card" style={{ padding: '16px' }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{shop.name}</div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>{shop.url}</div>
                <div className="flex-between">
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => openEdit(shop)}>Upravit</button>
                  <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => openDelete(shop)}>Smazat</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Componenty */}
      <Modal
        isOpen={modal.isOpen && modal.type === 'alert'}
        title={modal.title}
        onClose={closeModal}
        type="alert"
      >
        <p>{modal.message}</p>
      </Modal>

      <Modal
        isOpen={modal.isOpen && modal.type === 'delete'}
        title={modal.title}
        onClose={closeModal}
        onConfirm={executeDelete}
        confirmText="Smazat"
        type="danger"
      >
        <p>{modal.message}</p>
      </Modal>

      <Modal
        isOpen={modal.isOpen && modal.type === 'edit'}
        title={modal.title}
        onClose={closeModal}
        onConfirm={executeEdit}
        confirmText="Uložit"
        type="confirm"
      >
        <div className="form-group" style={{ textAlign: 'left' }}>
          <label>Název obchodu</label>
          <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
        </div>
        <div className="form-group" style={{ textAlign: 'left' }}>
          <label>Webová adresa (URL)</label>
          <input value={editForm.url} onChange={e => setEditForm({ ...editForm, url: e.target.value })} required />
        </div>
      </Modal>
    </div>
  );
}
