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
    if (!localStorage.getItem("firstTimeLoaded")) {
      localStorage.setItem("firstTimeLoaded", "true");
      window.location.reload();
    }
  }, []);

  {
    /*
    useEffect(() =>{
      document.title = "Home"
    },[])    
    */
  }

  return (
    <>
      <LocomotiveScrollProvider
        containerRef={containerRef}
        options={scrollOptions}
        watch={[Frontpage]}
      >
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
