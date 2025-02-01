import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import "./App.css";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import { Hero } from "./components/hero";
import { Navbar } from "./components/navbar";
import { Hackathon } from "./components/hackathons";
import { Cursor } from "./components/cursor";
import { BrowserRouter, Route, Routes } from "../node_modules/react-router-dom";

// build ke liye upar wala uncomment niche wala comment
// import { BrowserRouter, Route, Routes } from "react-router-dom";

export const Frontpage = () => {
  return (
    <div id="container">
      <Hero />
      <Hackathon />
    </div>
  );
};

function App() {
  const containerRef = useRef(null);

  const scrollOptions = {
    smooth: true,
    inertia: 0.6,
    smoothMobile: true,
    getDirection: true,
    readOnContextChange: true,
  };

  return (
    <>
      <LocomotiveScrollProvider
        containerRef={containerRef}
        options={scrollOptions}
        watch={[Frontpage]}
      >
        {/* <div className="cursor"></div> */}
        <Cursor />
        <main data-scroll-container ref={containerRef}>
          <div className="wrapper">
            <Navbar />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Frontpage />} />
              </Routes>
            </BrowserRouter>
          </div>
        </main>
      </LocomotiveScrollProvider>
    </>
  );
}

export default App;
