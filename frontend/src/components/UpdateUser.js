import React, { useState } from "react";
import axios from "axios";

const UpdateUser = ({ user, onUpdate }) => {
  const [name, setName] = useState(user[1]);
  const [email, setEmail] = useState(user[2]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/update-user/${user[0]}`, { name, email });
      onUpdate();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateUser;