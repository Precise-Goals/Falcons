import { useEffect, useRef } from "react"; // Ensure useRef is imported
import "./index.css";
import "./App.css";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import { Hero } from "./components/hero";
import { Navbar } from "./components/navbar";
import { Hackathon } from "./components/hackathons";
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

  useEffect(() => {
    const cursors = document.querySelectorAll(".cursor");

    const circle = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    const prev = { x: 0, y: 0 };
    let curr = 0;

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    const speed = 0.25;

    const tick = () => {
      let dx = mouse.x - circle.x;
      let dy = mouse.y - circle.y;
      circle.x += dx * speed;
      circle.y += dy * speed;

      const translate = `translate(${circle.x}px,${circle.y}px)`;

      const dX = mouse.x - prev.x;
      const dY = mouse.y - prev.y;

      prev.x = mouse.x;
      prev.y = mouse.y;

      const v = Math.min(Math.sqrt(dX ** 2 + dY ** 2), 100);
      const scV = (v / 100) * 0.5;

      curr += (scV - curr) * speed;

      const scale = `scale(${1 + curr},${1 - curr})`;

      cursors.forEach((cursor) => {
        cursor.style.transform = `${translate} ${scale}`;
      });

      window.requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return (
    <>
      <LocomotiveScrollProvider
        containerRef={containerRef}
        options={scrollOptions}
        watch={[Frontpage]}
      >
        <div className="cursor"></div>
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
