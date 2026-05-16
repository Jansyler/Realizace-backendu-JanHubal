import { useState, useEffect } from 'react';
import CategoryIcon from './CategoryIcon';

export default function Builder() {
  const [buildItems, setBuildItems] = useState([]);
  const [warnings, setWarnings] = useState([]);

  // Při prvním načtení stránky se podíváme, jestli máme něco uložené v lokální paměti prohlížeče
  useEffect(() => {
    const savedBuild = JSON.parse(localStorage.getItem('my_pc_build')) || [];
    
    // Načteme aktuální produkty a zkontrolujeme, zda se u některé z uložených položek nezměnila cena
    if (savedBuild.length > 0) {
      fetch('http://localhost:3000/product')
        .then(res => res.json())
        .then(products => {
          let hasChanges = false;
          let newWarnings = [];
          
          const updatedBuild = savedBuild.map(item => {
            // Zkontrolujeme, zda má položka productId (pro zpětnou kompatibilitu)
            if (!item.productId) return item;

            const dbProduct = products.find(p => p.id === item.productId);
            if (dbProduct) {
              const dbOffer = dbProduct.offers.find(o => o.shopId === item.offerShopId);
              if (dbOffer && dbOffer.price !== item.price) {
                newWarnings.push(`Cena u položky ${item.modelName} byla aktualizována z ${item.price} Kč na ${dbOffer.price} Kč.`);
                hasChanges = true;
                return { ...item, price: dbOffer.price };
              }
            }
            return item;
          });
          
          if (hasChanges) {
            setWarnings(newWarnings);
            setBuildItems(updatedBuild);
            localStorage.setItem('my_pc_build', JSON.stringify(updatedBuild)); // Uložíme nové ceny zpět
          } else {
            setBuildItems(savedBuild);
          }
        });
    } else {
      setBuildItems(savedBuild);
    }
  }, []);

  const clearBuild = () => {
    if(window.confirm('Opravdu vymazat celou sestavu?')) {
      localStorage.removeItem('my_pc_build');
      setBuildItems([]);
    }
  };

  // Odstraní konkrétní položku podle jejího indexu v poli
  const removeItem = (indexToRemove) => {
    const newBuild = buildItems.filter((_, index) => index !== indexToRemove);
    localStorage.setItem('my_pc_build', JSON.stringify(newBuild)); // Rovnou to uloží i do paměti
    setBuildItems(newBuild);
  };

  // reduce: projde všechny položky a postupně k 'sum' (které začíná na 0) přičte cenu každé položky
  const totalPrice = buildItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="builder-card">
      <div className="builder-header">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" style={{fill: '#333'}}><path d="M4 18h17v-6H4v6zM4 5v6h17V5H4z"/></svg>
          Moje PC Sestava
        </h2>
        <p>{buildItems.length} komponent</p>
      </div>

      {/* Zobrazení varování o změně ceny */}
      {warnings.length > 0 && (
        <div style={{backgroundColor: '#fff3cd', color: '#856404', padding: '15px', borderBottom: '1px solid #ffeeba'}}>
          <strong>Pozor:</strong>
          <ul style={{margin: '5px 0 0 20px', fontSize: '13px'}}>
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      <div>
        {buildItems.length === 0 ? (
          <div style={{padding: '30px', textAlign: 'center', color: '#999'}}>
            Vaše sestava je zatím prázdná. Přidejte komponenty z katalogu.
          </div>
        ) : (
          <div>
            {buildItems.map((item, index) => (
              <div key={index} className="builder-item">
                <div className="builder-item-img">
                  <CategoryIcon category={item.category} />
                </div>
                <div className="builder-item-info">
                  <div className="builder-item-title">{item.modelName}</div>
                  <div className="builder-item-cat">{item.category} z {item.shopName}</div>
                </div>
                <div className="builder-item-price">
                  {item.price} Kč
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{marginLeft: '20px', padding: '4px 8px', fontSize: '11px'}}
                  onClick={() => removeItem(index)}
                  title="Odstranit"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="builder-footer">
        <div className="builder-footer-text">Celková cena</div>
        <div className="builder-total">{totalPrice} Kč</div>
      </div>

      {buildItems.length > 0 && (
        <div style={{padding: '20px', textAlign: 'center'}}>
          <button className="btn btn-secondary" onClick={clearBuild}>Vymazat celou sestavu</button>
        </div>
      )}
    </div>
  );
}
