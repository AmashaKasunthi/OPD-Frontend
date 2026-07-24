import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditUser() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "",
        specialization: "",
        contactNumber: "",
    });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {

            const response = await API.get(`/admin/users/${id}`);

            setUser(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {

        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });

    };

    const updateUser = async (e) => {

        e.preventDefault();

        try {

            await API.put(`/admin/users/${id}`, user);

            alert("User updated successfully.");

            navigate("/view-users");

        } catch (error) {

            console.log(error);

            alert("Update failed.");

        }

    };

    return (

        <div className="min-h-screen bg-gray-100">

            <div className="max-w-3xl mx-auto py-10">

                <div className="bg-white shadow-lg rounded-xl p-8">

                    <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
                        Edit User
                    </h2>

                    <form onSubmit={updateUser}>

                        <div className="mb-4">

                            <label className="block mb-2 font-semibold">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                value={user.fullName}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="block mb-2 font-semibold">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="block mb-2 font-semibold">
                                Password
                            </label>

                            <input
                                type="text"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="block mb-2 font-semibold">
                                Role
                            </label>

                            <select
                                name="role"
                                value={user.role}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            >
                                <option value="DOCTOR">Doctor</option>
                                <option value="NURSE">Nurse</option>
                            </select>

                        </div>

                        <div className="mb-4">

                            <label className="block mb-2 font-semibold">
                                Specialization
                            </label>

                            <input
                                type="text"
                                name="specialization"
                                value={user.specialization}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                        </div>

                        <div className="mb-5">

                            <label className="block mb-2 font-semibold">
                                Contact Number
                            </label>

                            <input
                                type="text"
                                name="contactNumber"
                                value={user.contactNumber}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                        </div>

                        <div className="flex gap-4">

                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                            >
                                Update User
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/view-users")}
                                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default EditUser;