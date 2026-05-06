import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Catalog from './Catalog';
import Shops from './Shops';
import ProductDetail from './ProductDetail';
import Builder from './Builder';

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>RigRadar</h1>
        <nav>
          <Link to="/">1. Katalog</Link> |{' '}
          <Link to="/shops">2. Přidat obchod</Link> |{' '}
          <Link to="/builder">3. Moje PC Sestava</Link>
        </nav>
        <hr />
        
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/builder" element={<Builder />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
