import React, { useState, useEffect, useRef } from "react";

const DynamicCursor = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const cursorRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setCoords({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (cursorRef.current) {
        const { x, y } = coords;
        cursorRef.current.style.transform = `translate(${
          x + window.scrollX
        }px, ${y + window.scrollY}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [coords]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (cursor) {
      cursor.style.transition = "all 0.15s ease";
      cursor.style.transform = `translate(${coords.x + window.scrollX - 5}px, ${
        coords.y + window.scrollY - 5
      }px)`;
    }
  }, [coords]);

  return <div ref={cursorRef} className="cursor" style={cursorStyle}></div>;
};

const cursorStyle = {
  position: "absolute",
  width: "12px",
  height: "12px",
  backgroundColor: "black",
  borderRadius: "50%",
  pointerEvents: "none",
};

export default DynamicCursor;
