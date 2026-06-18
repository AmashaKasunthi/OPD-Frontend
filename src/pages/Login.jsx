import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await API.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("role", response.data.role);
            alert(response.data.message);
            navigate("/dashboard");

        } catch (error) {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
                    OPD Login
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded mb-4"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 rounded mb-4"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800"
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Login;