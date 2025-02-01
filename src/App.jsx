import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import "./App.css";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import { Hero } from "./components/hero";
import { Navbar } from "./components/navbar";
import { Hackathon } from "./components/hackathons";
import { Cursor } from "./components/cursor";
import { BrowserRouter, Route, Routes } from "../node_modules/react-router-dom";
import { About } from "./components/About";

// build ke liye upar wala uncomment niche wala comment
// import { BrowserRouter, Route, Routes } from "react-router-dom";

export const Frontpage = () => {
  return (
    <div id="container">
      <Hero />
      <Hackathon />
      <About />
    </div>
  );
};

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem("firstVisit") === null;
    if (isFirstVisit) {
      sessionStorage.setItem("firstVisit", "no");
      window.location.reload();
    }
    function HideBrowserScrollbar() {
      let scrollHide = document.createElement("style");
      scrollHide.innerHTML = `body::-webkit-scrollbar {display: none;}`;
      document.head.appendChild(scrollHide);
    }
    HideBrowserScrollbar();
  }, []);

  const scrollOptions = {
    smooth: true,
    inertia: 0.6,
    smoothMobile: true,
    getDirection: true,
    readOnContextChange: true,
    scrollbars: false,
  };

  return (
    <>
      <h1 className="handle">
        Site is Under Construction for Mobile and Tablets
      </h1>
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
