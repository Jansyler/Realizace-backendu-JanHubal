import { useState, useEffect } from 'react';

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const loadShops = () => {
    fetch('http://localhost:3000/shop')
      .then(res => res.json())
      .then(data => setShops(data));
  };

  useEffect(() => { loadShops(); }, []);

  const addShop = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/shop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, url })
    }).then(() => {
      setName(''); setUrl(''); loadShops();
      alert('Obchod úspěšně přidán!');
    });
  };

  const updateShop = (id) => {
    const newName = prompt("Zadej nový název obchodu:");
    if (newName) {
      fetch('http://localhost:3000/shop/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      }).then(() => loadShops());
    }
  };

  const deleteShop = (id) => {
    if(window.confirm('Opravdu smazat tento obchod?')) {
      fetch('http://localhost:3000/shop/' + id, { method: 'DELETE' })
        .then(() => loadShops());
    }
  };

  return (
    <div>
      <div className="card-container" style={{marginTop: '40px'}}>
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
          <button type="submit" className="btn" style={{width: '100%', marginTop: '10px'}}>Přidat obchod</button>
        </form>
      </div>

      {shops.length > 0 && (
        <div className="admin-actions">
          <h3 style={{marginBottom: '20px', fontSize: '16px'}}>Spravovat existující obchody (Admin)</h3>
          <div className="product-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'}}>
            {shops.map(shop => (
              <div key={shop.id} className="product-card" style={{padding: '16px'}}>
                <div style={{fontWeight: 600, marginBottom: '4px'}}>{shop.name}</div>
                <div style={{fontSize: '12px', color: '#999', marginBottom: '16px'}}>{shop.url}</div>
                <div className="flex-between">
                  <button className="btn btn-secondary" style={{padding: '4px 8px', fontSize: '11px'}} onClick={() => updateShop(shop.id)}>Upravit</button>
                  <button className="btn btn-danger" style={{padding: '4px 8px', fontSize: '11px'}} onClick={() => deleteShop(shop.id)}>Smazat</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
