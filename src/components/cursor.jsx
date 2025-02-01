import React, { useEffect } from "react";

export const Cursor = () => {
  useEffect(() => {
    const cursors = document.querySelectorAll(".cursor");
    const hoverElements = document.querySelectorAll(
      "a, button,.heText, li, .cl"
    );

    const circle = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    let prev = { x: 0, y: 0 };
    let curr = 0;

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursors.forEach((cursor) => cursor.classList.add("hover"));
      });
      el.addEventListener("mouseleave", () => {
        cursors.forEach((cursor) => cursor.classList.remove("hover"));
      });
    });

    const speed = 1;

    const tick = () => {
      let dx = mouse.x - circle.x;
      let dy = mouse.y - circle.y;
      circle.x += dx * speed;
      circle.y += dy * speed;

      const translate = `translate(${circle.x}px,${circle.y}px)`;

      const dX = mouse.x - prev.x;
      const dY = mouse.y - prev.y;

      prev = { ...mouse };

      const v = Math.min(Math.sqrt(dX ** 2 + dY ** 2), 150);
      const scV = (v / 150) * 0.5;

      curr += (scV - curr) * speed;

      const scale = `scale(${1 + curr},${1 - curr})`;
      const rotate = `rotate(${(Math.atan2(dY, dX) * 180) / Math.PI}deg)`;

      const re = document.querySelectorAll(".cursor.hover");
      re.forEach((curs) => {
        curs.style.transform = `scale(2)`;
      });

      cursors.forEach((cursor) => {
        cursor.style.transform = `${translate} ${rotate} ${scale}`;
      });

      window.requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return <div className="cursor"></div>;
};
