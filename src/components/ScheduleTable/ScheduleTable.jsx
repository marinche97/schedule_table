import React, { useState, useEffect } from "react";
import "./ScheduleTable.css";
import { ref, onValue, set, remove, db } from "../../firebase";
import AdminControls from "./AdminControls/AdminControls";
import ScheduleTableContent from "./ScheduleTableContent/ScheduleTableContent";
import StudentScheduleTable from "./StudentScheduleTable/StudentScheduleTable";

function ScheduleTable({ grade, isAdminMode }) {
  const [weeks, setWeeks] = useState([]);
  const [schedule, setSchedule] = useState({
    "1c": { weeks: [], data: {} },
    "2c": { weeks: [], data: {} },
    "3c": { weeks: [], data: {} },
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
    // Flatten the `weeks` array and default `days` to an empty array if missing, ensuring valid values
    const uniqueDays = Array.from(
      new Set(weeks.flatMap((week) => week?.days || []))
    );

    // Filter to only include valid days and sort according to `dayOrder`
    return uniqueDays
      .filter((day) => dayOrder.includes(day))
      .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
  };

  const [allUniqueDays, setAllUniqueDays] = useState([]);

  useEffect(() => {
    setAllUniqueDays(getAllUniqueDays());
  }, [weeks]);

  useEffect(() => {
    if (grade) {
      const scheduleRef = ref(db, `schedule`);
      onValue(scheduleRef, (snapshot) => {
        debugger;
        const fetchedSchedule = snapshot.val();

        for (const savedGrade in fetchedSchedule) {
          const savedScheduleForGrade = fetchedSchedule[savedGrade];
          const savedWeeks = savedScheduleForGrade.weeks;
          const savedData = savedScheduleForGrade.data;

          for (const savedWeek of savedWeeks) {
            if (!savedWeek.days) {
              savedWeek.days = [];
            }

            if (!savedData[savedWeek.week]) {
              savedData[savedWeek.week] = [];
            }
          }
        }

        console.log(fetchedSchedule);

        if (fetchedSchedule) {
          setSchedule(fetchedSchedule);
          setWeeks(fetchedSchedule[grade]?.weeks || []);
        }
      });
    }
  }, [grade]);

  useEffect(() => {
    setLockedWeeks((prevLockedWeeks) =>
      prevLockedWeeks.filter((index) => index < weeks.length - 1)
    );
  }, [weeks]);

  const saveSchedule = async () => {
    setLockedWeeks(weeks.map((_, index) => index));
    setEditingWeekIndex(null);

    const scheduleRef = ref(db, `schedule`);
    try {
      console.log(JSON.parse(JSON.stringify(schedule)));
      await set(scheduleRef, schedule);
      console.log("Schedule saved successfully.");
    } catch (error) {
      console.error("Error saving schedule", error);
    }
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

  const addWeek = async () => {
    const updatedSchedule = { ...schedule };

    if (!updatedSchedule[grade]) {
      updatedSchedule[grade] = { weeks: [], data: {} };
    }

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

    if (!currentGradeSchedule.data) {
      currentGradeSchedule.data = {};
    }

    currentGradeSchedule.data[newWeekNumber] = [];

    try {
      const scheduleRef = ref(db, `schedule`);
      await set(scheduleRef, updatedSchedule);
      setWeeks(currentGradeSchedule.weeks);
      setSchedule(updatedSchedule);

      const lockedWeeks = currentGradeSchedule.weeks
        .filter((week) => week.week !== newWeekNumber)
        .map((week) => week.week);

      setLockedWeeks(lockedWeeks);
      setEditingWeekIndex(currentGradeSchedule.weeks.length - 1);
    } catch (error) {
      console.error("Error saving new week to Firebase:", error);
    }
  };

  const deleteWeek = async (weekIndex) => {
    const updatedWeeks = weeks.filter((_, index) => index !== weekIndex);
    const updatedSchedule = { ...schedule };

    const currentGradeSchedule = updatedSchedule[grade] || {
      weeks: [],
      data: {},
    };
    const weekNumber = weeks[weekIndex].week;

    currentGradeSchedule.weeks = updatedWeeks;
    delete currentGradeSchedule.data[weekNumber];

    setWeeks(updatedWeeks);
    setSchedule(updatedSchedule);

    try {
      const weekRef = ref(db, `schedules/${grade}/data/${weekNumber}`);
      await remove(weekRef);
      const scheduleRef = ref(db, `schedules/${grade}`);
      await set(scheduleRef, updatedSchedule);
      console.log("Week deleted successfully from Firebase.");
    } catch (error) {
      console.error("Error deleting week from Firebase:", error);
    }

    setLockedWeeks((prevLockedWeeks) =>
      prevLockedWeeks.filter((index) => index !== weekIndex)
    );
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
    <div className={`schedule-table-container razred-${grade}`}>
      <h2>{`Raspored vježbi test ${grade}`}</h2>
      {isAdminMode ? (
        <div>
          <AdminControls
            weeks={weeks}
            toggleDaySelection={toggleDaySelection}
            addWeek={addWeek}
            saveSchedule={saveSchedule}
            editingWeekIndex={editingWeekIndex}
          />
          <ScheduleTableContent
            weeks={weeks || []}
            allUniqueDays={allUniqueDays || []}
            schedule={schedule}
            grade={grade}
            adminMode={isAdminMode}
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
