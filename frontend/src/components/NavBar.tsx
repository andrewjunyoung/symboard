import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <div className="nav-logo">
          <Link to="/">Oneβöard</Link>
        </div>
        <div className="nav-links">
          <Link to="/demo" className="nav-link">Demo</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
