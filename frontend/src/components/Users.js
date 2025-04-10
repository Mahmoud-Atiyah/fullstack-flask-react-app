import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/delete-user/${id}`);
      setUsers(users.filter(user => user[0] !== id)); // Update UI
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const UpdateUser = ({ user, onUpdate }) => {
    return (
      <div>
        <p>Update form for {user[1]}</p>
        <button onClick={onUpdate}>Done</button>
      </div>
    );
  };  

  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/users")
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map((user, index) => (
            <li key={index}>
                {user[1]} - {user[2]} 
                <button onClick={() => setEditingUser(user)}>Edit</button>
                <button onClick={() => deleteUser(user[0])}>Delete</button>
                {editingUser && editingUser[0] === user[0] && (
                    <UpdateUser user={user} onUpdate={() => setEditingUser(null)} />
                )}
            </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;