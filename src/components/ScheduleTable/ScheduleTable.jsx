import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (grade) {
      setWeeks(schedule[grade]?.weeks || []);
    }
  }, [grade, schedule]);

  const toggleDaySelection = (weekIndex, clickedDay) => {
    const updatedWeeks = [...weeks];
    const selectedWeek = updatedWeeks[weekIndex];

    if (selectedWeek.days.includes(clickedDay)) {
      selectedWeek.days = selectedWeek.days.filter(
        (selectedDay) => selectedDay !== clickedDay
      );
    } else {
      selectedWeek.days.push(clickedDay);
    }

    setWeeks(updatedWeeks);
  };

  const addWeek = () => {
    const updatedSchedule = { ...schedule };
    const currentGradeSchedule = updatedSchedule[grade];

    const newWeek = { week: currentGradeSchedule.weeks.length + 1, days: [] };
    const newWeekData = newWeek.days.map(() => ({
      subjects: Array(3).fill(""),
      groups: Array(3).fill(""),
    }));

    currentGradeSchedule.weeks.push(newWeek);
    currentGradeSchedule.data[newWeek.week] = newWeekData;

    setWeeks(currentGradeSchedule.weeks);
    setSchedule(updatedSchedule);
  };

  const saveSchedule = () => {
    console.log("saving schedule:", schedule);
  };

  const ensureDataStructure = (gradeSchedule, weekIndex, dayIndex) => {
    // Koristimo weekIndex direktno za pristup
    const week = gradeSchedule.weeks[weekIndex]; // Dohvaćamo tjedan s pomoću indeksa

    // Ako podaci za određeni tjedan ne postoje, inicijaliziraj ih kao prazan objekt
    if (!gradeSchedule.data[week.week]) {
      gradeSchedule.data[week.week] = {};
    }

    // Ako podaci za određeni dan u tjednu ne postoje, inicijaliziraj ih s praznim predloškom
    if (!gradeSchedule.data[week.week][dayIndex]) {
      gradeSchedule.data[week.week][dayIndex] = {
        subjects: Array(3).fill(""), // Prazni niz predmeta
        groups: Array(3).fill(""), // Prazni niz grupa
      };
    }
  };

  const handleSubjectChange = (
    weekIndex,
    dayIndex,
    subjectIndex,
    newSubject
  ) => {
    const updatedSchedule = { ...schedule };
    const currentGradeSchedule = updatedSchedule[grade];

    // Provjeravamo i inicijaliziramo potrebne strukture podataka za tjedan i dan
    ensureDataStructure(currentGradeSchedule, weekIndex, dayIndex);

    // Ažuriramo predmet
    currentGradeSchedule.data[currentGradeSchedule.weeks[weekIndex].week][
      dayIndex
    ].subjects[subjectIndex] = newSubject;

    setSchedule(updatedSchedule); // Postavljamo ažurirani raspored
  };

  const handleGroupChange = (weekIndex, dayIndex, groupIndex, newGroup) => {
    const updatedSchedule = { ...schedule };
    const currentGradeSchedule = updatedSchedule[grade];

    // Provjeravamo i inicijaliziramo potrebne strukture podataka za tjedan i dan
    ensureDataStructure(currentGradeSchedule, weekIndex, dayIndex);

    // Ažuriramo grupu
    currentGradeSchedule.data[currentGradeSchedule.weeks[weekIndex].week][
      dayIndex
    ].groups[groupIndex] = newGroup;

    setSchedule(updatedSchedule); // Postavljamo ažurirani raspored
  };

  const allUniqueDays = Array.from(new Set(weeks.flatMap((week) => week.days)));

  return (
    <div>
      <h2>{`${grade.toUpperCase()} Raspored`}</h2>
      {adminMode ? (
        <div>
          <AdminControls
            weeks={weeks}
            toggleDaySelection={toggleDaySelection}
            addWeek={addWeek}
            saveSchedule={saveSchedule}
          />
          <ScheduleTableContent
            weeks={weeks}
            allUniqueDays={allUniqueDays}
            schedule={schedule}
            grade={grade}
            adminMode={adminMode}
            handleSubjectChange={handleSubjectChange}
            handleGroupChange={handleGroupChange}
          />
        </div>
      ) : (
        <StudentScheduleTable weeks={weeks} schedule={schedule} grade={grade} />
      )}
    </div>
  );
}

export default ScheduleTable;
