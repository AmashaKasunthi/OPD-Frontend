import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function ViewUsers() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await API.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    try {

      await API.delete(`/admin/users/${id}`);

      alert("User deleted successfully");

      loadUsers();

    } catch (error) {

      console.log(error);

      alert("Delete failed");

    }

  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto p-8">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-3xl font-bold">
            Manage Users
          </h2>

          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-gray-700 text-white px-5 py-2 rounded-lg"
          >
            Dashboard
          </button>

        </div>

        <input
          type="text"
          placeholder="Search user..."
          className="w-full border rounded-lg p-3 mb-6"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <table className="w-full bg-white shadow rounded-lg">

          <thead className="bg-slate-800 text-white">

            <tr>

              <th className="p-3">ID</th>

              <th>Name</th>

              <th>Email</th>

              <th>Role</th>

              <th>Specialization</th>

              <th>Contact</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.map(user=>(

              <tr
                key={user.userId}
                className="border-b text-center"
              >

                <td className="p-3">{user.userId}</td>

                <td>{user.fullName}</td>

                <td>{user.email}</td>

                <td>{user.role}</td>

                <td>{user.specialization}</td>

                <td>{user.contactNumber}</td>

                <td>

                  <button
                    onClick={()=>navigate(`/edit-user/${user.userId}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={()=>deleteUser(user.userId)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default ViewUsers;