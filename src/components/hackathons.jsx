import React from "react";
import { hackathonData } from "./data";
import "./hax.css";
import { Link } from "react-router";

export const Hackathon = () => {
  return (
    <div id="hc">
      <div className="hhead">
        <p>Our Upcoming</p>
        <h1>HACKATHONS</h1>
        <div className="hcontainer">
          {[...hackathonData].reverse().map((dat, index) => {
            return (
              <Link to={dat.url} target="_blank" key={index}>
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
                        Status: ({dat.status}) <br /> date posted: {dat.date}
                      </span>
                    </div>
                  </div>
                  <div className="lcr">
                    <img src={dat.img} alt={dat.hackTitle} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <p className="more">More Coming Soon...</p>
    </div>
  );
};
