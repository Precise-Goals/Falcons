import React from 'react'
import '../App.css'
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { currentUser, openAuthModal, logout } = useAuth();

  return (
    <div className='navbar'>
      <ul className="rl">
        <Link to="/"><li>Home</li></Link>
        <Link to="/teams"><li>Teams</li></Link>
        <a href="https://gdg.community.dev/gdg-on-campus-nutan-maharashtra-institute-of-engineering-and-technology-pune-india/"
          target="_blank" rel="noopener noreferrer">
          <li>Communities</li>
        </a>
      </ul>

      <h1 className="cl">Falcons.</h1>

      <ul className="ll">
        <Link to="/policies"><li>Policies</li></Link>
        <a href="https://github.com/Falcon-s-Hackathon-Community"
          target="_blank" rel="noopener noreferrer">
          <li>Organization</li>
        </a>
        {currentUser ? (
          <li onClick={logout} style={{ cursor: 'pointer' }}>Sign Out</li>
        ) : (
          <li onClick={openAuthModal} style={{ cursor: 'pointer' }}>Log In</li>
        )}
      </ul>
    </div>
  )
}
