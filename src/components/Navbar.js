import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation Bar Component
 * Responsive navbar with links to all RTE pages
 */
const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', name: 'Home', icon: 'house' },
    { path: '/tinymce', name: 'TinyMCE', icon: 'pencil-square' },
    { path: '/quill', name: 'Quill', icon: 'feather' },
    { path: '/lexical', name: 'Lexical', icon: 'code-square' },
    { path: '/editorjs', name: 'Editor.js', icon: 'grid-3x3-gap' }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-journal-text me-2"></i>
          React RTE Demo
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                {item.path === '/' ? (
                  <button
                    className={`nav-link d-flex align-items-center btn btn-link px-0${location.pathname === '/' ? ' active' : ''}`}
                    style={{ textDecoration: 'none' }}
                    onClick={() => {
                      window.location.href = `${process.env.PUBLIC_URL || ''}/#/`;
                      setTimeout(() => {
                      window.location.reload();
                      }, 100);
                    }}
                  >
                    <i className={`bi bi-${item.icon} me-1`}></i>
                    {item.name}
                  </button>
                ) : (
                  <Link 
                    className={`nav-link d-flex align-items-center${location.pathname === item.path ? ' active' : ''}`}
                    to={item.path}
                  >
                    <i className={`bi bi-${item.icon} me-1`}></i>
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
