import React from "react";

const DaySelector = ({ selectedDays, allDaysOfWeek, onDayToggle }) => (
  <div>
    {allDaysOfWeek.map((day) => (
      <div key={day}>
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
