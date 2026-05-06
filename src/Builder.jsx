import { useState, useEffect } from 'react';

export default function Builder() {
  const [buildItems, setBuildItems] = useState([]);

  // Načtení z paměti prohlížeče
  useEffect(() => {
    const savedBuild = JSON.parse(localStorage.getItem('my_pc_build')) || [];
    setBuildItems(savedBuild);
  }, []);

  const clearBuild = () => {
    localStorage.removeItem('my_pc_build');
    setBuildItems([]);
  };

  const removeItem = (indexToRemove) => {
    const newBuild = buildItems.filter((_, index) => index !== indexToRemove);
    localStorage.setItem('my_pc_build', JSON.stringify(newBuild));
    setBuildItems(newBuild);
  };

  // Sečtení celkové ceny
  const totalPrice = buildItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2>Moje PC Sestava</h2>

      {buildItems.length === 0 ? (
        <p>Sestava je prázdná.</p>
      ) : (
        <ul>
          {buildItems.map((item, index) => (
            <li key={index}>
              {item.modelName} (z {item.shopName}) - <strong>{item.price} Kč</strong>
              <button onClick={() => removeItem(index)} style={{ marginLeft: '10px' }}>Odstranit</button>
            </li>
          ))}
        </ul>
      )}

      {buildItems.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Celková cena: {totalPrice} Kč</h3>
          <button onClick={clearBuild}>Vymazat celou sestavu</button>
        </div>
      )}
    </div>
  );
}
