import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import "./App.css";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import { Hero } from "./components/hero";
import { Navbar } from "./components/navbar";
import { Hackathon } from "./components/hackathons";
import { Cursor } from "./components/cursor";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { About } from "./components/About";
import { Teams } from "./containers/Teams";
import { Policies } from "./containers/Policies";
import { AuthProvider } from "./context/AuthContext";
import { GlobalAuthModal } from "./components/teams/AuthModal";
import { Toaster } from "react-hot-toast";
import { FeedbackSection } from "./components/FeedbackSection";

export const Frontpage = () => (
  <div id="container">
    <Hero />
    <Hackathon />
    <About />
    <FeedbackSection />
  </div>
);

/* ── Desktop layout: LocomotiveScroll ────────────────────── */
const DesktopLayout = () => {
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
    smoothMobile: false,
    getDirection: true,
    readOnContextChange: true,
    scrollbars: false,
  };

  return (
    <LocomotiveScrollProvider
      containerRef={containerRef}
      options={scrollOptions}
      watch={[Frontpage]}
    >
      <Cursor />
      <main data-scroll-container ref={containerRef}>
        <div className="wrapper">
          <Navbar />
          <Frontpage />
        </div>
      </main>
    </LocomotiveScrollProvider>
  );
};

/* ── Mobile layout: native scroll ───────────────────────── */
const MobileLayout = () => (
  <div className="wrapper">
    <Navbar />
    <Frontpage />
  </div>
);

/* ── Main Layout: switches based on screen width ─────────── */
const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

/* ── Inner App ───────────────────────────────────────────── */
const AppInner = () => (
  <>
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/policies" element={<Policies />} />
    </Routes>

    {/* Single global auth modal */}
    <GlobalAuthModal />
  </>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>

      {/* Global toast */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111111",
            color: "#f0f0f0",
            borderRadius: "999px",
            padding: "10px 20px",
            fontSize: "13px",
            fontFamily: "Inter, Montserrat, sans-serif",
            letterSpacing: "0.02em",
            border: "1px solid #2a2a2a",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          },
          duration: 3000,
          success: { iconTheme: { primary: "#f0f0f0", secondary: "#111" } },
          error:   { iconTheme: { primary: "#f0f0f0", secondary: "#111" } },
        }}
      />
    </AuthProvider>
  );
}

export default App;
