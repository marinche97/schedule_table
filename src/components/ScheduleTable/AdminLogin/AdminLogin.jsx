import React, { useState } from "react";
import "./AdminLogin.css";

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="admin-login">
      <h2>Admin prijava</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Korisničko ime:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Lozinka:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Prijava</button>
      </form>
    </div>
  );
};
export default AdminLogin;
