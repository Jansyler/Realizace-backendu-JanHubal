import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams(); // Získá ID z URL adresy
  const [product, setProduct] = useState(null);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    // Načteme všechny produkty a najdeme ten náš
    fetch('http://localhost:3000/product')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id === id);
        setProduct(found);
      });

    // Načteme obchody, abychom znali jejich názvy podle shopId
    fetch('http://localhost:3000/shop')
      .then(res => res.json())
      .then(data => setShops(data));
  }, [id]);

  const getShopName = (shopId) => {
    const shop = shops.find(s => s.id === shopId);
    return shop ? shop.name : 'Neznámý obchod';
  };

  // Uložení pouze na frontendu do LocalStorage
  const addToBuild = (offer) => {
    const currentBuild = JSON.parse(localStorage.getItem('my_pc_build')) || [];
    currentBuild.push({
      modelName: product.modelName,
      price: offer.price,
      shopName: getShopName(offer.shopId)
    });
    localStorage.setItem('my_pc_build', JSON.stringify(currentBuild));
    alert('Přidáno do PC Sestavy!');
  };

  if (!product) return <div>Načítání...</div>;

  return (
    <div>
      <h2>{product.modelName}</h2>
      <p>Kategorie: {product.category}</p>

      <h3>Srovnání cen ({product.offers ? product.offers.length : 0} nabídky)</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Obchod</th>
            <th>Cena</th>
            <th>Akce</th>
          </tr>
        </thead>
        <tbody>
          {product.offers && product.offers.map((offer, index) => (
            <tr key={index}>
              <td>{getShopName(offer.shopId)}</td>
              <td>{offer.price} Kč</td>
              <td>
                <button onClick={() => addToBuild(offer)}>Koupit / Přidat do sestavy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
