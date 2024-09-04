import React from "react";
import "./DaySelector.css";

const DaySelector = ({ selectedDays, allDaysOfWeek, onDayToggle }) => (
  <div className="day-selector">
    {allDaysOfWeek.map((day) => (
      <div key={day} className="day-selector-div">
        <input
          type="checkbox"
          checked={selectedDays.includes(day)}
          onChange={() => onDayToggle(day)}
        />
        {day}
      </div>
    ))}
  </div>
);

export default DaySelector;
