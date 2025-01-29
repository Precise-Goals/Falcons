import React from "react";
import "../App.css";

export const Hero = () => {
  return (
    // <div className="Hero">
    //   <h1>We are Falcons</h1>
    //   <h2>Take A leap of Faith</h2>
    // </div>
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
        <button className="b1">Login</button>
        <button className="b2">
          Know More <span>↗</span>
        </button>
      </ul>
      <p className="scroll">Scroll down</p>
    </div>
  );
};
