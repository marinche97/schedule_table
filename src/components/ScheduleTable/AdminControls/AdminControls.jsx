import React from "react";
import DaySelector from "../DaySelector/DaySelector";

const allDaysOfWeek = [
  "Ponedjeljak",
  "Utorak",
  "Srijeda",
  "Četvrtak",
  "Petak",
  "Subota",
];

const AdminControls = ({
  weeks,
  toggleDaySelection,
  addWeek,
  saveSchedule,
}) => {
  return (
    <div>
      {weeks.map((week, index) => (
        <div key={week.week}>
          <h3>{`Tjedan ${week.week}`}</h3>
          <DaySelector
            selectedDays={week.days}
            allDaysOfWeek={allDaysOfWeek}
            onDayToggle={(day) => toggleDaySelection(index, day)}
          />
        </div>
      ))}
      <button onClick={addWeek}>Dodaj tjedan</button>
      <button onClick={saveSchedule}>Spremi raspored</button>
    </div>
  );
};

export default AdminControls;
