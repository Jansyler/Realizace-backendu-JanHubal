import { useState, useEffect } from 'react';

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  // Read
  const loadShops = () => {
    fetch('http://localhost:3000/shop')
      .then(res => res.json())
      .then(data => setShops(data));
  };

  useEffect(() => { loadShops(); }, []);

  // Create
  const addShop = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/shop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, url })
    }).then(() => {
      setName(''); setUrl(''); loadShops();
    });
  };

  // Update
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

  // Delete
  const deleteShop = (id) => {
    fetch('http://localhost:3000/shop/' + id, { method: 'DELETE' })
      .then(() => loadShops());
  };

  return (
    <div>
      <h2>Správa obchodů</h2>
      
      <form onSubmit={addShop}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Název" required />
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" required />
        <button type="submit">Přidat obchod</button>
      </form>

      <ul>
        {shops.map(shop => (
          <li key={shop.id}>
            {shop.name} ({shop.url}) 
            <button onClick={() => updateShop(shop.id)}>Upravit</button>
            <button onClick={() => deleteShop(shop.id)}>Smazat</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
