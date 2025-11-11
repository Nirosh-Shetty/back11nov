/*
 * Create this file at: src/Components/CheckoutDateStrip.jsx
 */
import React, { useRef, useState, useEffect } from "react";
import "../Styles/CheckoutDateStrip.css"; // Import the new CSS

// Simple SVG for arrows
const ArrowLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const CheckoutDateStrip = ({ dates, activeDateKey, onDateSelect }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, [dates]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="checkout-date-strip-container">
      <button
        className="checkout-date-nav-btn"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
      >
        <ArrowLeft />
      </button>

      <div className="date-strip-scroller" ref={scrollRef}>
        {dates.map((d) => (
          <div
            key={d.dateKey}
            className={`date-card-checkout ${
              d.dateKey === activeDateKey ? "active" : ""
            }`}
            onClick={() => onDateSelect(d.dateKey)}
          >
            <div className="day">{d.label}</div>
            <div className="date">{d.displayDate}</div>
          </div>
        ))}
      </div>

      <button
        className="checkout-date-nav-btn"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
      >
        <ArrowRight />
      </button>
    </div>
  );
};

export default CheckoutDateStrip;