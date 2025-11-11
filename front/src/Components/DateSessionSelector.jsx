import React, {useRef } from "react";
import "../Styles/DateSessionSelector.css";

const getNextSevenDays = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    // ++ THIS IS THE FIX ++
    // Create a new Date object in UTC, not local time
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + i));
    // -- No setHours() needed, Date.UTC() is already at midnight --

    // const label =
    //   i === 0 ? "Today" : i === 1 ? "Tomorrow" : days[date.getUTCDay()]; // Use getUTCDay()
    // const label=["Today","Tomorrow"];
    const label =
      i === 0 ? "Today" : i === 1 ? "Tomorrow" : null; // Use getUTCDay()
    result.push({
      label,
      date: date.getUTCDate(), // Use getUTCDate()
      month: date.toLocaleString("default", { month: "short" }),
      weekday: date.toLocaleString("default", { weekday: "long" }),
      dateObj: date, // This is now a UTC-normalized Date object
    });
  }
  return result;
};

// 1. Accept the new props: currentDate and currentSession
const DateSessionSelector = ({ onChange, currentDate, currentSession }) => {
  
  // 2. We still get the 7 days, but we don't set local state from it anymore
  const dates = getNextSevenDays();
  const scrollRef = useRef(null);

  // 3. REMOVE the internal useState for activeDate and activeSession
  // const [activeDate, setActiveDate] = useState(null); // <-- REMOVED
  // const [activeSession, setActiveSession] = useState("Lunch"); // <-- REMOVED

  // 4. REMOVE the useEffect that was causing the bug
  // useEffect(() => {
  //   if (onChange && activeDate) onChange(activeDate, activeSession);
  // }, [activeDate, activeSession, onChange]); // <-- REMOVED

  // 5. Create new click handlers that just call the onChange prop directly
  const handleDateClick = (dateObj) => {
    onChange(dateObj, currentSession); // Pass the new date and the *current* session
  };

  const handleSessionClick = (session) => {
    onChange(currentDate, session); // Pass the *current* date and the new session
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  const handleReset = () => {
    // Reset just calls onChange with today's date
    const next = getNextSevenDays();
    onChange(next[0].dateObj, "Lunch");
  };

  return (
    <div className="date-session-wrapper">
       <div className="reset-line">
        <span className="reset-btn" onClick={handleReset}>
          Reset to now ↻
        </span>
      </div>
      <div className="date-header">
        <button className="nav-btn" onClick={scrollLeft}>
           <img src="/Assets/circleleft.svg" viewBox='0 0 24 24' fill='green' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'
            style={{
              transform:'rotate(180deg)'
            }}
           />
        </button>

        <div className="date-strip" ref={scrollRef}>
          {dates.map((d, i) => (
            <div
              key={i}
              // 6. Check active status against the PROPS, not internal state
              className={`date-card ${
                currentDate &&
                d.dateObj.toISOString() === currentDate.toISOString()
                  ? "active"
                  : ""
              }`}
              // 7. Call the new click handler
              onClick={() => handleDateClick(d.dateObj)}
            >
              <div className="day">{d.label}</div>
              <div className="date">{`${d.date} ${d.month}`}</div>
              <div className="weekday">{d.weekday}</div>
            </div>
          ))}
        </div>

        <button className="nav-btn" onClick={scrollRight}>
          <img src="/Assets/circleleft.svg" viewBox='0 0 24 24' fill='green' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
        </button>
      </div>

   

      <div className="session-container">
             <div className={`session-btn-wrapper ${currentSession === "Lunch" ? "active" : ""}`}>
        <button
          // 8. Check active status against the PROPS
          className={`session ${currentSession === "Lunch" ? "active" : ""}`}
          // 9. Call the new click handler
          onClick={() => handleSessionClick("Lunch")}
        >
          <div className="title">Lunch</div>
          <div className="subtext">Order before 12:00 PM</div>
        </button></div>

        <div className={`session-btn-wrapper ${currentSession === "Dinner" ? "active" : ""}`}>
        <button
          className={`session ${currentSession === "Dinner" ? "active" : ""}`}
          onClick={() => handleSessionClick("Dinner")}
        >
          <div className="title">Dinner</div>
          <div className="subtext">Order before 07:00 PM</div>
        </button></div>
      </div>
    </div>
  );
};

export default DateSessionSelector;