import React from "react";
import "../App.css";
import { useAuth } from "../context/AuthContext";

export const Hero = () => {
  const { currentUser, openAuthModal } = useAuth();

  return (
    <div className="try">
      <h3>
        <i>We are</i>
      </h3>
      <h1>
        <span>F</span>ALCONS
      </h1>
      <div className="herocontent">
        <h5>Take a leap of faith</h5>
        <hr />
      </div>
      <ul className="butons">
        {!currentUser && (
          <button className="b1" onClick={openAuthModal}>
            Login
          </button>
        )}
        <button className="b2">
          Know More <span>↗</span>
        </button>
      </ul>
      <p className="scroll">Scroll down</p>
    </div>
  );
};
