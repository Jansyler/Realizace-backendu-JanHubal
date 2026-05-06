import { useState, useEffect } from 'react';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [modelName, setModelName] = useState('');
  const [category, setCategory] = useState('');

  const loadProducts = () => {
    fetch('http://localhost:3000/product')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => { loadProducts(); }, []);

  const addProduct = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelName, category, offers: [] })
    }).then(() => {
      setModelName(''); setCategory(''); loadProducts();
    });
  };

  const updateProduct = (id) => {
    const newName = prompt("Zadej nový název produktu:");
    if (newName) {
      fetch('http://localhost:3000/product/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName: newName })
      }).then(() => loadProducts());
    }
  };

  const deleteProduct = (id) => {
    fetch('http://localhost:3000/product/' + id, { method: 'DELETE' })
      .then(() => loadProducts());
  };

  return (
    <div>
      <h2>Správa produktů</h2>
      
      <form onSubmit={addProduct}>
        <input value={modelName} onChange={e => setModelName(e.target.value)} placeholder="Název" required />
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Kategorie" required />
        <button type="submit">Přidat produkt</button>
      </form>

      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.modelName} [{product.category}] 
            <button onClick={() => updateProduct(product.id)}>Upravit</button>
            <button onClick={() => deleteProduct(product.id)}>Smazat</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
