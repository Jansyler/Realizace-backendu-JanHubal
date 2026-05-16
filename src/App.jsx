import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import Catalog from './Catalog';
import Shops from './Shops';
import ProductDetail from './ProductDetail';
import Builder from './Builder';

export default function App() {
  // State pro přepínání pohledů (zda jsme v admin režimu). Uložíme i do localStorage, aby to vydrželo refresh.
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('is_admin') === 'true';
  });

  const toggleAdmin = () => {
    const newVal = !isAdmin;
    setIsAdmin(newVal);
    localStorage.setItem('is_admin', newVal);
  };
  return (
    // BrowserRouter obaluje celou aplikaci a stará se o to, aby fungovalo překlikávání URL bez znovunačtení stránky
    <BrowserRouter>
      <div className="container">
        {/* Sloučená a kompaktní hlavička */}
        <header className="main-header">
          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Katalog</NavLink>
            <NavLink to="/shops" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Přidat obchod</NavLink>
            <NavLink to="/builder" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>PC Sestava</NavLink>
          </nav>

          <div className="header-actions">
            {/* Tlačítko na přepínání rolí pro ukázku */}
            <button onClick={toggleAdmin} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
              {isAdmin ? 'Pohled: Admin' : 'Pohled: Uživatel'}
            </button>
          </div>
        </header>

        {/* Routes definuje, jaká komponenta se má zobrazit pro konkrétní URL cestu */}
        <Routes>
          <Route path="/" element={<Catalog isAdmin={isAdmin} />} />
          <Route path="/shops" element={<Shops isAdmin={isAdmin} />} />
          <Route path="/product/:id" element={<ProductDetail />} /> {/* :id je dynamický parametr (např. /product/p1) */}
          <Route path="/builder" element={<Builder />} />
        </Routes>

        {/* Nová patička (Footer) */}
        <footer className="main-footer">
          <div className="footer-links">
            <NavLink to="/">Katalog</NavLink>
            <NavLink to="/shops">Přidat obchod</NavLink>
            <NavLink to="/builder">PC Sestava</NavLink>
          </div>
          <p>&copy; {new Date().getFullYear()} Jan Hubal. Všechna práva vyhrazena.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
