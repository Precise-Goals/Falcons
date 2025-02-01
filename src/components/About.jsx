import React from "react";
import "./styles.css";
import saVideo from "../assets/3.png";

export const About = () => {
  return (
    <div className="abcontainer">
      <div className="abimg">
        <img src={saVideo} alt="img" />
      </div>
      {/* <video src={saVideo} muted autoPlay loop></video> */}
      <div className="heText">
        <h1>OUR STORY</h1>
        <p>
          The Falcons Hackathon Club was created to explore diverse
          opportunities and add fun to our learning. We're an innovative
          technical coding community at NMIET, Pune, focused on skill
          enhancement through collaboration and friendly competition.
        </p>
        <button>Join Now</button>
      </div>
    </div>
  );
};
