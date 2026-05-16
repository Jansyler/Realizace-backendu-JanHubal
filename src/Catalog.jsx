import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Catalog({ isAdmin }) {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState('');

  const [modelName, setModelName] = useState('');
  const [category, setCategory] = useState('');

  const loadData = () => {
    // 1. Načteme všechny obchody (potřebujeme je pro zobrazení jmen obchodů u nabídek)
    fetch('http://localhost:3000/shop')
      .then(res => res.json())
      .then(data => setShops(data));

    // 2. Načteme produkty. Pokud je zadaný text v hledání, přidáme query parametr ?search=
    fetch(`http://localhost:3000/product${search ? '?search=' + search : ''}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  // useEffect se spustí poprvé při načtení stránky a pak pokaždé, když se změní stav 'search' (vyhledávání)
  useEffect(() => { loadData(); }, [search]);

  const addProduct = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelName, category, offers: [] })
    }).then(() => {
      setModelName(''); setCategory(''); loadData();
    });
  };

  const updateProduct = (e, id) => {
    e.preventDefault();
    const newName = prompt("Zadej nový název produktu:");
    if (newName) {
      fetch('http://localhost:3000/product/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName: newName })
      }).then(() => loadData());
    }
  };

  const deleteProduct = (e, id) => {
    e.preventDefault();
    if (window.confirm('Opravdu smazat?')) {
      fetch('http://localhost:3000/product/' + id, { method: 'DELETE' })
        .then(() => loadData());
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  // Pomocná funkce, která projde všechny nabídky a najde tu s nejnižší cenou
  const getLowestPriceInfo = (offers) => {
    if (!offers || offers.length === 0) return { price: 'Nedostupné', shop: '' };

    let lowest = offers[0]; // Na začátku předpokládáme, že první nabídka je ta nejlevnější
    for (let i = 1; i < offers.length; i++) {
      if (offers[i].price < lowest.price) {
        lowest = offers[i];
      }
    }

    // Podle ID obchodu najdeme v poli 'shops' jeho skutečný název
    const shop = shops.find(s => s.id === lowest.shopId);
    return {
      price: `${lowest.price} Kč`,
      shop: shop ? shop.name : 'Neznámý'
    };
  };

  return (
    <div>
      <p className="text-center" style={{ color: '#777', marginBottom: '30px' }}>Katalog PC komponent</p>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Hledat komponentu..."
        />
        <button type="submit" className="btn">Hledat</button>
      </form>

      <div className="product-grid">
        {products.map(product => {
          const info = getLowestPriceInfo(product.offers);
          return (
            <Link to={`/product/${product.id}`} className="product-card" key={product.id}>
              <div className="img-placeholder">
                <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
              </div>
              <div className="card-category">{product.category}</div>
              <div className="card-title">{product.modelName}</div>
              <div className="card-footer">
                <span className="card-price">{info.price}</span>
                <span className="card-shop">{info.shop}</span>
              </div>

              {/* Admin actions: Ukážou se pouze, pokud je zapnutý pohled Admina */}
              {isAdmin && (
                <div className="mt-4 gap-2 flex-between" style={{ borderTop: '1px solid #eee', paddingTop: '10px' }} onClick={e => e.preventDefault()}>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={(e) => updateProduct(e, product.id)}>Upravit</button>
                  <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={(e) => deleteProduct(e, product.id)}>Smazat</button>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Formulář na přidání nového produktu vidí jen Admin */}
      {isAdmin && (
        <div className="admin-actions card-container">
          <h2>Přidat nový produkt (Admin)</h2>
          <form onSubmit={addProduct}>
            <div className="form-group">
              <label>Název produktu</label>
              <input value={modelName} onChange={e => setModelName(e.target.value)} placeholder="např. NVIDIA RTX 4060" required />
            </div>
            <div className="form-group">
              <label>Kategorie</label>
              <input value={category} onChange={e => setCategory(e.target.value)} placeholder="např. Grafická karta" required />
            </div>
            <button type="submit" className="btn" style={{ width: '100%' }}>Přidat produkt</button>
          </form>
        </div>
      )}
    </div>
  );
}
