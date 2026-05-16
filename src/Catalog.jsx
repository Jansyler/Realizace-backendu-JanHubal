import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryIcon from './CategoryIcon';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState('');

  const [modelName, setModelName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedShopId, setSelectedShopId] = useState('');
  const [price, setPrice] = useState('');

  // Předdefinované kategorie komponent
  const PREDEFINED_CATEGORIES = [
    "Procesor",
    "Grafická karta",
    "Základní deska",
    "Operační paměť (RAM)",
    "Pevný disk (SSD/HDD)",
    "Zdroj",
    "Počítačová skříň",
    "Chlazení"
  ];

  const loadData = () => {
    // 1. Načteme všechny obchody (potřebujeme je pro zobrazení jmen obchodů u nabídek)
    fetch('http://localhost:3000/shop')
      .then(res => res.json())
      .then(data => setShops(data));

    // 2. Načteme všechny produkty najednou
    fetch('http://localhost:3000/product')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  // Načteme data jen při prvním načtení stránky (nebo po přidání nového produktu)
  useEffect(() => { loadData(); }, []);

  // Filtrace produktů na frontendu – vyhledáváme v názvu i v kategorii!
  const filteredProducts = products.filter(product => {
    const s = search.toLowerCase();
    const matchName = product.modelName.toLowerCase().includes(s);
    const matchCat = product.category.toLowerCase().includes(s);
    return matchName || matchCat;
  });

  const addProduct = (e) => {
    e.preventDefault();
    
    // Zkusíme najít existující produkt se stejným názvem
    const existingProduct = products.find(p => p.modelName.toLowerCase().trim() === modelName.toLowerCase().trim());

    if (existingProduct) {
      if (selectedShopId && price) {
        const newOffer = { shopId: selectedShopId, price: Number(price) };
        const updatedOffers = existingProduct.offers ? [...existingProduct.offers, newOffer] : [newOffer];

        fetch(`http://localhost:3000/product/${existingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offers: updatedOffers })
        }).then(() => {
          setModelName(''); setCategory(''); setSelectedShopId(''); setPrice(''); loadData();
        });
      } else {
        alert("Zadejte prosím obchod a cenu pro přidání nabídky k existujícímu produktu.");
      }
      return;
    }

    // Pokud uživatel zadal obchod a cenu a produkt neexistuje, vytvoříme rovnou první nabídku
    const newOffers = [];
    if (selectedShopId && price) {
      newOffers.push({ shopId: selectedShopId, price: Number(price) });
    }

    fetch('http://localhost:3000/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelName, category, offers: newOffers })
    }).then(() => {
      setModelName(''); setCategory(''); setSelectedShopId(''); setPrice(''); loadData();
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
    // Nemusíme znovu načítat data ze serveru, filtrujeme už lokálně při psaní
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
        {filteredProducts.map(product => {
          const info = getLowestPriceInfo(product.offers);
          return (
            <Link to={`/product/${product.id}`} className="product-card" key={product.id}>
              <div className="img-placeholder">
                <CategoryIcon category={product.category} />
              </div>
              <div className="card-category">{product.category}</div>
              <div className="card-title">{product.modelName}</div>
              <div className="card-footer">
                <span className="card-price">{info.price}</span>
                <span className="card-shop">{info.shop}</span>
              </div>

              <div className="mt-4 gap-2 flex-between" style={{ borderTop: '1px solid #eee', paddingTop: '10px' }} onClick={e => e.preventDefault()}>
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={(e) => updateProduct(e, product.id)}>Upravit</button>
                <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={(e) => deleteProduct(e, product.id)}>Smazat</button>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="admin-actions card-container">
        <h2>Přidat nový produkt</h2>
        <form onSubmit={addProduct}>
          <div className="form-group">
            <label>Název produktu</label>
            <input value={modelName} onChange={e => setModelName(e.target.value)} placeholder="např. NVIDIA RTX 4060" required />
          </div>
          <div className="form-group">
            <label>Kategorie</label>
            <select value={category} onChange={e => setCategory(e.target.value)} required>
              <option value="">-- Vyberte kategorii --</option>
              {PREDEFINED_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Výchozí obchod (volitelné)</label>
            <select value={selectedShopId} onChange={e => setSelectedShopId(e.target.value)}>
              <option value="">-- Vyberte obchod --</option>
              {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Cena (Kč)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="např. 15000" />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>Přidat produkt</button>
        </form>
      </div>
    </div>
  );
}
