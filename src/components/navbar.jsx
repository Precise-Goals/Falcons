import React, { useState, useEffect } from 'react';
import '../App.css';
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { currentUser, openAuthModal, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for navbar background shift
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        {/* Left nav links */}
        <ul className="rl">
          <Link to="/" onClick={closeMenu}><li>Home</li></Link>
          <Link to="/teams" onClick={closeMenu}><li>Teams</li></Link>
          <a
            href="https://gdg.community.dev/gdg-on-campus-nutan-maharashtra-institute-of-engineering-and-technology-pune-india/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <li>Communities</li>
          </a>
        </ul>

        {/* Centre logo */}
        <div className="navbar-logo-wrap">
          <Link to="/" onClick={closeMenu}>
            <h1 className="cl">Falcons.</h1>
          </Link>
        </div>

        {/* Right nav links */}
        <ul className="ll">
          <Link to="/policies" onClick={closeMenu}><li>Policies</li></Link>
          <a
            href="https://github.com/Falcon-s-Hackathon-Community"
            target="_blank"
            rel="noopener noreferrer"
          >
            <li>Organization</li>
          </a>
          {currentUser ? (
            <li onClick={() => { logout(); closeMenu(); }} style={{ cursor: 'pointer' }}>
              Sign Out
            </li>
          ) : (
            <li onClick={() => { openAuthModal(); closeMenu(); }} style={{ cursor: 'pointer' }}>
              Log In
            </li>
          )}
        </ul>

        {/* Hamburger (mobile only) */}
        <button
          className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile overlay backdrop */}
      <div
        className={`navbar-mobile-overlay${menuOpen ? ' open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile slide-in drawer */}
      <nav className={`navbar-mobile-drawer${menuOpen ? ' open' : ''}`} aria-label="Mobile navigation">
        <span className="navbar-mobile-brand">Falcons.</span>

        <Link to="/" onClick={closeMenu}><li>Home</li></Link>
        <Link to="/teams" onClick={closeMenu}><li>Teams</li></Link>
        <a
          href="https://gdg.community.dev/gdg-on-campus-nutan-maharashtra-institute-of-engineering-and-technology-pune-india/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
        >
          <li>Communities</li>
        </a>
        <Link to="/policies" onClick={closeMenu}><li>Policies</li></Link>
        <a
          href="https://github.com/Falcon-s-Hackathon-Community"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
        >
          <li>Organization</li>
        </a>
        {currentUser ? (
          <li onClick={() => { logout(); closeMenu(); }} style={{ cursor: 'pointer' }}>
            Sign Out
          </li>
        ) : (
          <li onClick={() => { openAuthModal(); closeMenu(); }} style={{ cursor: 'pointer' }}>
            Log In
          </li>
        )}
      </nav>
    </>
  );
};
