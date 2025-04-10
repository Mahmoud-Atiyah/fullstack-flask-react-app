import React, { useState, useEffect } from "react";
import axios from "axios";
import Users from "./components/Users";
import AddUser from "./components/AddUser";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios.get("http://127.0.0.1:5000/users")
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AuthProvider>
      <div className="App">
        <h1>React + Flask + MySQL Authentication</h1>
  
        <Register />
        <Login />
  
        {/* 👇 This shows the Add User form */}
        <AddUser onUserAdded={fetchUsers} />
  
        {/* 👇 This displays the list of users */}
        <Users />
      </div>
    </AuthProvider>
  );  
}

export default App;
