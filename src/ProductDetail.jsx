import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CategoryIcon from './CategoryIcon';

export default function ProductDetail() {
  const { id } = useParams(); // Získáme parametr 'id' z aktuální URL adresy (např. 'p1' z /product/p1)
  const [product, setProduct] = useState(null);
  const [shops, setShops] = useState([]);

  // Spustí se hned po načtení detailu, a pak znovu, kdykoliv by se změnilo 'id' v URL
  useEffect(() => {
    // Stáhneme všechny produkty a vyfiltrujeme jen ten, jehož id odpovídá id z URL
    fetch('http://localhost:3000/product')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id === id);
        setProduct(found);
      });

    fetch('http://localhost:3000/shop')
      .then(res => res.json())
      .then(data => setShops(data));
  }, [id]);

  const getShopName = (shopId) => {
    const shop = shops.find(s => s.id === shopId);
    return shop ? shop.name : 'Neznámý obchod';
  };

  // Přidání produktu do naší "PC Sestavy" (uložíme to lokálně v prohlížeči přes localStorage)
  const addToBuild = (offer) => {
    const currentBuild = JSON.parse(localStorage.getItem('my_pc_build')) || []; // Pokud tam nic není, vrátí prázdné pole
    
    // Kontrola, jestli už nemáme v sestavě produkt stejné kategorie
    const existingIndex = currentBuild.findIndex(item => item.category === product.category);
    
    if (existingIndex !== -1) {
      const replace = window.confirm(`V sestavě už máte položku v kategorii "${product.category}". Chcete ji nahradit? \n\n(Klikněte OK pro nahrazení, Zrušit pro přidání dalšího kusu jako duplikát.)`);
      if (replace) {
        currentBuild.splice(existingIndex, 1); // Odstraní starou položku
      }
    }

    currentBuild.push({
      productId: product.id, // Ukládáme i ID produktu a obchodu kvůli pozdější kontrole cen
      offerShopId: offer.shopId,
      modelName: product.modelName,
      category: product.category,
      price: offer.price,
      shopName: getShopName(offer.shopId)
    });
    localStorage.setItem('my_pc_build', JSON.stringify(currentBuild));
    alert('Přidáno do PC Sestavy!');
  };

  if (!product) return <div className="text-center" style={{padding: '50px', color: '#999'}}>Načítání...</div>;

  // Najdeme nejnižší cenu pro odznáček
  let lowestPrice = Infinity;
  if (product.offers) {
    product.offers.forEach(o => {
      if (o.price < lowestPrice) lowestPrice = o.price;
    });
  }

  // Mock specs based on category
  const getMockSpecs = (cat) => {
    const lcat = cat.toLowerCase();
    if(lcat.includes('procesor')) return '6 jader / 12 vláken • 3.8 GHz';
    if(lcat.includes('grafická karta')) return '8GB GDDR6 • PCIe 4.0';
    if(lcat.includes('ram')) return 'DDR5 • 6000 MHz • CL36';
    if(lcat.includes('ssd')) return 'M.2 NVMe • Čtení 7000 MB/s';
    return 'Standardní specifikace';
  };

  return (
    <div>
      <div className="breadcrumbs">
        <Link to="/">Hardware Checker</Link> / <Link to="/">Katalog</Link> / <span>Detail</span>
      </div>

      <div className="detail-header">
        <div className="detail-img">
          <CategoryIcon category={product.category} />
        </div>
        <div className="detail-info">
          <h2>{product.modelName}</h2>
          <p>{product.category} · {getMockSpecs(product.category)}</p>
        </div>
      </div>

      <div className="section-title">
        Srovnání cen — {product.offers ? product.offers.length : 0} obchody
      </div>

      <table className="modern-table">
        <thead>
          <tr>
            <th>Obchod</th>
            <th>Cena</th>
            <th>Akce</th>
          </tr>
        </thead>
        <tbody>
          {product.offers && product.offers.sort((a, b) => a.price - b.price).map((offer, index) => (
            <tr key={index}>
              <td>
                {offer.price === lowestPrice && <span className="badge-cheapest">NEJLEVNĚJŠÍ</span>}
                {getShopName(offer.shopId)}
              </td>
              <td className="price-bold">{offer.price} Kč</td>
              <td>
                <button className="btn btn-secondary" style={{padding: '6px 12px', fontSize: '13px'}} onClick={() => addToBuild(offer)}>
                  Přidat do sestavy
                </button>
              </td>
            </tr>
          ))}
          {(!product.offers || product.offers.length === 0) && (
            <tr>
              <td colSpan="3" className="text-center" style={{padding: '30px', color: '#999'}}>Tento produkt zatím nemá žádné nabídky.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
