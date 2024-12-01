import React from "react";
import TableCell from "../../TableCell/TableCell";
import "../ScheduleTable.css";
import { subjectClasses, groups } from "../../Data/Data";

const ScheduleTableContent = ({
  weeks,
  allUniqueDays,
  schedule,
  grade,
  adminMode,
  handleSubjectChange,
  handleGroupChange,
  lockedWeeks,
  unlockWeek,
  editingWeekIndex,
  deleteWeek,
}) => {
  return (
    <table className="schedule-table">
      <thead>
        <tr>
          <th></th>
          {allUniqueDays.map((day) => (
            <th key={day}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks
          .slice()
          .reverse()
          .map((week, weekIndex) => (
            <tr key={week.week}>
              <td>{`Tjedan ${week.week}`}</td>
              {allUniqueDays.map((day) => {
                const dayIndex = week.days.indexOf(day);
                return dayIndex !== -1 ? (
                  <TableCell
                    key={`${week.week}-${day}`}
                    subjects={subjectClasses[grade]}
                    groups={groups}
                    selectedSubject={
                      schedule[grade]?.data[week.week]?.[dayIndex]?.subjects ||
                      []
                    }
                    selectedGroup={
                      schedule[grade]?.data[week.week]?.[dayIndex]?.groups || []
                    }
                    adminMode={adminMode && !lockedWeeks.includes(weekIndex)}
                    onChangeSubject={(subjectIndex, newSubject) =>
                      handleSubjectChange(
                        weeks.length - 1 - weekIndex,
                        dayIndex,
                        subjectIndex,
                        newSubject
                      )
                    }
                    onChangeGroup={(groupIndex, newGroup) =>
                      handleGroupChange(
                        weeks.length - 1 - weekIndex,
                        dayIndex,
                        groupIndex,
                        newGroup
                      )
                    }
                  />
                ) : (
                  <td key={`${week.week}-${day}`} />
                );
              })}
              {adminMode && lockedWeeks.includes(weekIndex) && (
                <td>
                  <button onClick={() => unlockWeek(weekIndex)}>Uredi</button>
                  <button
                    onClick={() => deleteWeek(weeks.length - 1 - weekIndex)}
                  >
                    Obriši
                  </button>
                </td>
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default ScheduleTableContent;
