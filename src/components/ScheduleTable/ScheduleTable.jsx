import React, { useState, useEffect } from "react";
import "./ScheduleTable.css";
import AdminControls from "./AdminControls/AdminControls";
import ScheduleTableContent from "./ScheduleTableContent/ScheduleTableContent";
import StudentScheduleTable from "./StudentScheduleTable/StudentScheduleTable";

function ScheduleTable({ grade, adminMode }) {
  const [weeks, setWeeks] = useState([]);
  const [schedule, setSchedule] = useState({
    "1.c": { weeks: [], data: {} },
    "2.c": { weeks: [], data: {} },
    "3.c": { weeks: [], data: {} },
  });
  const [lockedWeeks, setLockedWeeks] = useState([]);
  const [editingWeekIndex, setEditingWeekIndex] = useState(null);

  const dayOrder = [
    "Ponedjeljak",
    "Utorak",
    "Srijeda",
    "Četvrtak",
    "Petak",
    "Subota",
  ];

  const getAllUniqueDays = () => {
    const uniqueDays = Array.from(new Set(weeks.flatMap((week) => week.days)));
    return uniqueDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
  };

  const allUniqueDays = getAllUniqueDays(); // Define it once here

  useEffect(() => {
    if (grade) {
      setWeeks(schedule[grade]?.weeks || []);
    }
  }, [grade, schedule]);

  useEffect(() => {
    setLockedWeeks((prevLockedWeeks) =>
      prevLockedWeeks.filter((index) => index < weeks.length - 1)
    );
  }, [weeks]);

  const saveSchedule = () => {
    setLockedWeeks(weeks.map((_, index) => index));
    setEditingWeekIndex(null);
  };

  const unlockWeek = (weekIndex) => {
    setLockedWeeks((prevLockedWeeks) =>
      prevLockedWeeks.filter((index) => index !== weekIndex)
    );
    setEditingWeekIndex(weekIndex);
  };

  const toggleDaySelection = (weekIndex, clickedDay) => {
    const updatedWeeks = [...weeks];
    const selectedWeek = updatedWeeks[weekIndex];

    if (selectedWeek.days.includes(clickedDay)) {
      selectedWeek.days = selectedWeek.days.filter(
        (selectedDay) => selectedDay !== clickedDay
      );
    } else {
      selectedWeek.days.push(clickedDay);
      selectedWeek.days.sort(
        (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
      );
    }

    setWeeks(updatedWeeks);
  };

  const addWeek = () => {
    const updatedSchedule = { ...schedule };
    const currentGradeSchedule = updatedSchedule[grade];

    const newWeekNumber = currentGradeSchedule.weeks.length + 1;
    const newWeek = { week: newWeekNumber, days: [] };

    dayOrder.forEach((day) => {
      if (allUniqueDays.includes(day)) {
        newWeek.days.push(day);
      }
    });

    newWeek.days = newWeek.days.sort(
      (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
    );

    currentGradeSchedule.weeks.push(newWeek);
    currentGradeSchedule.data[newWeekNumber] = [];

    setWeeks(currentGradeSchedule.weeks);
    setSchedule(updatedSchedule);

    const lockedWeeks = currentGradeSchedule.weeks
      .filter((week) => week.week !== newWeekNumber)
      .map((week) => week.week);

    setLockedWeeks(lockedWeeks);
    setEditingWeekIndex(currentGradeSchedule.weeks.length - 1);
  };

  const handleSubjectChange = (
    weekIndex,
    dayIndex,
    subjectIndex,
    newSubject
  ) => {
    const updatedSchedule = { ...schedule };
    const currentGradeSchedule = updatedSchedule[grade];

    if (
      !currentGradeSchedule.data[currentGradeSchedule.weeks[weekIndex].week][
        dayIndex
      ]
    ) {
      currentGradeSchedule.data[currentGradeSchedule.weeks[weekIndex].week][
        dayIndex
      ] = {
        subjects: Array(3).fill(""),
        groups: Array(3).fill(""),
      };
    }

    currentGradeSchedule.data[currentGradeSchedule.weeks[weekIndex].week][
      dayIndex
    ].subjects[subjectIndex] = newSubject;

    setSchedule(updatedSchedule);
  };

  const handleGroupChange = (weekIndex, dayIndex, groupIndex, newGroup) => {
    const updatedSchedule = { ...schedule };
    const currentGradeSchedule = updatedSchedule[grade];

    if (
      !currentGradeSchedule.data[currentGradeSchedule.weeks[weekIndex].week][
        dayIndex
      ]
    ) {
      currentGradeSchedule.data[currentGradeSchedule.weeks[weekIndex].week][
        dayIndex
      ] = {
        subjects: Array(3).fill(""),
        groups: Array(3).fill(""),
      };
    }

    currentGradeSchedule.data[currentGradeSchedule.weeks[weekIndex].week][
      dayIndex
    ].groups[groupIndex] = newGroup;

    setSchedule(updatedSchedule);
  };

  return (
    <div
      className={`schedule-table-container razred-${grade.replace(".", "")}`}
    >
      <h2>{`Raspored vježbi ${grade}`}</h2>
      {adminMode ? (
        <div>
          <AdminControls
            weeks={weeks}
            toggleDaySelection={toggleDaySelection}
            addWeek={addWeek}
            saveSchedule={saveSchedule}
            editingWeekIndex={editingWeekIndex}
          />
          <ScheduleTableContent
            weeks={weeks}
            allUniqueDays={allUniqueDays}
            schedule={schedule}
            grade={grade}
            adminMode={adminMode}
            handleSubjectChange={handleSubjectChange}
            handleGroupChange={handleGroupChange}
            lockedWeeks={lockedWeeks}
            unlockWeek={unlockWeek}
            dayOrder={dayOrder}
            editingWeekIndex={editingWeekIndex}
          />
        </div>
      ) : (
        <StudentScheduleTable weeks={weeks} schedule={schedule} grade={grade} />
      )}
    </div>
  );
}

export default ScheduleTable;
