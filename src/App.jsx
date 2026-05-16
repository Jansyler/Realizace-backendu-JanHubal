import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Catalog from './Catalog';
import Shops from './Shops';
import ProductDetail from './ProductDetail';
import Builder from './Builder';

export default function App() {
  return (
    // BrowserRouter obaluje celou aplikaci a stará se o to, aby fungovalo překlikávání URL bez znovunačtení stránky
    <BrowserRouter>
      <div className="container">
        <nav className="nav-bar">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Katalog</NavLink>
          <NavLink to="/shops" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Přidat obchod</NavLink>
          <NavLink to="/builder" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>PC Sestava</NavLink>
        </nav>

        <header className="page-header">
          <h1>Hardware Checker</h1>
        </header>

        {/* Routes definuje, jaká komponenta se má zobrazit pro konkrétní URL cestu */}
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/product/:id" element={<ProductDetail />} /> {/* :id je dynamický parametr (např. /product/p1) */}
          <Route path="/builder" element={<Builder />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
