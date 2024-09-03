import React from "react";
import ScheduleTableContent from "../ScheduleTableContent/ScheduleTableContent";

const StudentScheduleTable = ({ weeks, schedule, grade }) => {
  const allUniqueDays = Array.from(new Set(weeks.flatMap((week) => week.days)));

  return (
    <ScheduleTableContent
      weeks={weeks}
      allUniqueDays={allUniqueDays}
      schedule={schedule}
      grade={grade}
      adminMode={false}
    />
  );
};

export default StudentScheduleTable;
