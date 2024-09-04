import { useState } from "react";
import "./App.css";
import ScheduleTable from "./components/ScheduleTable/ScheduleTable";

function App() {
  const [selectedGrade, setSelectedGrade] = useState("");
  const [adminMode, setAdminMode] = useState(true);

  const handleGradeSelection = (grade) => setSelectedGrade(grade);
  return (
    <div className="App">
      <h1>Zdravstveno-laboratorijski tehničar</h1>
      <div>
        <button onClick={() => setAdminMode(!adminMode)}>
          {adminMode ? "Switch to Student Mode" : "Switch to Admin Mode"}
        </button>
      </div>
      <button onClick={() => handleGradeSelection("1.c")} type="button">
        1.c razred
      </button>
      <button onClick={() => handleGradeSelection("2.c")} type="button">
        2.c razred
      </button>
      <button onClick={() => handleGradeSelection("3.c")} type="button">
        3.c razred
      </button>
      {selectedGrade && (
        <ScheduleTable grade={selectedGrade} adminMode={adminMode} />
      )}
    </div>
  );
}

export default App;
