import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Catalog from './Catalog';
import Shops from './Shops';
import ProductDetail from './ProductDetail';
import Builder from './Builder';

export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <nav className="nav-bar">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>1. Katalog</NavLink>
          <NavLink to="/shops" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>2. Přidat obchod</NavLink>
          {/* Detail a ceny normálně nemají odkaz v navigaci, je tam přesmerován z katalogu. Builder ano. */}
          <NavLink to="/builder" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>4. PC Sestava</NavLink>
        </nav>
        
        <header className="page-header">
          <h1>Hardware Checker</h1>
        </header>
        
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
