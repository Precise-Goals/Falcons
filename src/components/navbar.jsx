import React from 'react'
import '../App.css'

export const Navbar = () => {
  return (
    <div className='navbar'>
        <ul className="rl">
            <li>About Us</li>
            <li>Hackathons</li>
        </ul>
        <h1 className="cl">Falcons.</h1>
        <ul className="ll">
            <li>Community</li>
            <li>Portfolio</li>
        </ul>
    </div>
  )
}
