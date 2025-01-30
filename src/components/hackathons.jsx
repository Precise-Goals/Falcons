import React from "react";
import { hackathonData } from "./data";
import "./hax.css";

export const Hackathon = () => {
  return (
    <div id="hc">
      <div className="hhead">
        <p>Our Upcoming</p>
        <h1>HACKATHONS</h1>
        <div className="hcontainer">
          {hackathonData.map((dat, index) => {
            return (
              <a href={`${dat.url}`} key={index}>
                <div className="hcard" key={index}>
                  <div
                    className="pseud"
                    style={{ background: `url(${dat.color})` }}
                  ></div>
                  <div className="rcr">
                    <h1>
                      {dat.hackTitle.split(" ")[0]} <br />
                      <span>{dat.hackTitle.split(" ")[1]}</span>
                    </h1>
                    <div className="tex">
                      <p>{dat.hackDesc}</p>
                      <span>
                        Status:`({dat.status})` date posted: {dat.date}
                      </span>
                    </div>
                  </div>
                  <div className="lcr">
                    <img src={dat.img} alt={dat.hackTitle} />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      <p className="more">More Coming Soon...</p>
    </div>
  );
};
