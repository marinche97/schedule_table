import { useState } from "react";
import "./App.css";
import ScheduleTable from "./components/ScheduleTable/ScheduleTable";
import AdminLogin from "./components/ScheduleTable/AdminLogin/AdminLogin";

function App() {
  const [selectedGrade, setSelectedGrade] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const adminCredentials = {
    username: "admin",
    password: "admin",
  };

  const handleAdminLogin = (username, password) => {
    if (
      username === adminCredentials.username &&
      password === adminCredentials.password
    ) {
      setIsAdminMode(true);
      setShowLogin(false);
    } else {
      alert("Neispravno korisničko ime ili lozinka");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
  };

  const handleGradeSelection = (grade) => setSelectedGrade(grade);

  return (
    <div className="App">
      <h1>Zdravstveno-laboratorijski tehničar</h1>
      <div>
        {!isAdminMode ? (
          <button type="button" onClick={() => setShowLogin(true)}>
            Admin login
          </button>
        ) : (
          <button type="button" onClick={handleAdminLogout}>
            Logout
          </button>
        )}
      </div>
      {showLogin && !isAdminMode && <AdminLogin onLogin={handleAdminLogin} />}

      <button onClick={() => handleGradeSelection("1c")} type="button">
        1.c razred
      </button>
      <button onClick={() => handleGradeSelection("2c")} type="button">
        2.c razred
      </button>
      <button onClick={() => handleGradeSelection("3c")} type="button">
        3.c razred
      </button>
      {selectedGrade && (
        <ScheduleTable grade={selectedGrade} isAdminMode={isAdminMode} />
      )}
    </div>
  );
}

export default App;
