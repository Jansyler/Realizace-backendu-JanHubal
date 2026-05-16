import { useState, useEffect } from 'react';

export default function Builder() {
  const [buildItems, setBuildItems] = useState([]);

  useEffect(() => {
    const savedBuild = JSON.parse(localStorage.getItem('my_pc_build')) || [];
    setBuildItems(savedBuild);
  }, []);

  const clearBuild = () => {
    if(window.confirm('Opravdu vymazat celou sestavu?')) {
      localStorage.removeItem('my_pc_build');
      setBuildItems([]);
    }
  };

  const removeItem = (indexToRemove) => {
    const newBuild = buildItems.filter((_, index) => index !== indexToRemove);
    localStorage.setItem('my_pc_build', JSON.stringify(newBuild));
    setBuildItems(newBuild);
  };

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
                  <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
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
