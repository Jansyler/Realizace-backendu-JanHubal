import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryIcon from './CategoryIcon';
import Modal from './Modal';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState('');

  const [modelName, setModelName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedShopId, setSelectedShopId] = useState('');
  const [price, setPrice] = useState('');

  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', message: '', id: null });
  const [editForm, setEditForm] = useState({ modelName: '', category: '' });

  const closeModal = () => setModal({ isOpen: false, type: '', title: '', message: '', id: null });

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
        let updatedOffers = existingProduct.offers ? [...existingProduct.offers] : [];

        // Zkontrolujeme, jestli už od tohoto obchodu nemáme u produktu nabídku
        const existingOfferIndex = updatedOffers.findIndex(o => o.shopId === selectedShopId);

        if (existingOfferIndex !== -1) {
          // Pokud nabídka od obchodu existuje a cena je stejná, nemá smysl nic dělat
          if (updatedOffers[existingOfferIndex].price === Number(price)) {
            setModal({ isOpen: true, type: 'alert', title: 'Chyba', message: 'Tato nabídka se stejnou cenou a obchodem už u produktu existuje.', id: null });
            return;
          } else {
            // Pokud je cena jiná, pouze stávající nabídku zaktualizujeme novou cenou
            updatedOffers[existingOfferIndex].price = Number(price);
          }
        } else {
          // Jinak přidáme novou nabídku
          updatedOffers.push({ shopId: selectedShopId, price: Number(price) });
        }

        fetch(`http://localhost:3000/product/${existingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offers: updatedOffers })
        }).then(() => {
          setModelName(''); setCategory(''); setSelectedShopId(''); setPrice(''); loadData();
          setModal({ isOpen: true, type: 'alert', title: 'Úspěch', message: 'Nabídka produktu byla aktualizována!', id: null });
        });
      } else {
        setModal({ isOpen: true, type: 'alert', title: 'Upozornění', message: 'Zadejte prosím obchod a cenu pro přidání nabídky k existujícímu produktu.', id: null });
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

  const openEditProduct = (e, product) => {
    e.preventDefault();
    setEditForm({ modelName: product.modelName, category: product.category });
    setModal({ isOpen: true, type: 'edit', title: 'Upravit produkt', message: '', id: product.id });
  };

  const executeEditProduct = () => {
    if (editForm.modelName.trim() !== '' && editForm.category.trim() !== '') {
      fetch('http://localhost:3000/product/' + modal.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName: editForm.modelName, category: editForm.category })
      }).then(() => {
        loadData();
        closeModal();
      });
    }
  };

  const openDeleteProduct = (e, product) => {
    e.preventDefault();
    setModal({ isOpen: true, type: 'delete', title: 'Smazat produkt', message: 'Opravdu si přejete smazat tento produkt?', id: product.id });
  };

  const executeDeleteProduct = () => {
    fetch('http://localhost:3000/product/' + modal.id, { method: 'DELETE' })
      .then(() => {
        loadData();
        closeModal();
      });
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
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={(e) => openEditProduct(e, product)}>Upravit</button>
                <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={(e) => openDeleteProduct(e, product)}>Smazat</button>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="form-section card-container">
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

      {/* Modal Componenty*/}
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
        onConfirm={executeDeleteProduct}
        confirmText="Smazat"
        type="danger"
      >
        <p>{modal.message}</p>
      </Modal>

      <Modal
        isOpen={modal.isOpen && modal.type === 'edit'}
        title={modal.title}
        onClose={closeModal}
        onConfirm={executeEditProduct}
        confirmText="Uložit"
        type="confirm"
      >
        <div className="form-group" style={{ textAlign: 'left' }}>
          <label>Název produktu</label>
          <input value={editForm.modelName} onChange={e => setEditForm({ ...editForm, modelName: e.target.value })} required />
        </div>
        <div className="form-group" style={{ textAlign: 'left' }}>
          <label>Kategorie</label>
          <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} required>
            <option value="">-- Vyberte kategorii --</option>
            {PREDEFINED_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </Modal>
    </div>
  );
}
