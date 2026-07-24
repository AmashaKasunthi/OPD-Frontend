import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async () => {

        setError("");
        setLoading(true);

        try {

            const response = await API.post("/admin/login", {
                email,
                password
            });

            localStorage.setItem("adminId", response.data.adminId);
            localStorage.setItem("adminName", response.data.fullName);

            navigate("/admin-dashboard");

        } catch (err) {

            setError("Invalid email or password");

        } finally {

            setLoading(false);

        }

    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") login();
    }

    return (

        <div className="flex justify-center items-center min-h-screen bg-slate-900">

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 w-full max-w-md shadow-xl">

                <h2 className="text-xl font-semibold mb-1 text-center text-slate-100">
                    Admin Login
                </h2>
                <p className="text-sm text-slate-400 text-center mb-6">
                    Sign in to access the dashboard
                </p>

                {error && (
                    <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                        {error}
                    </div>
                )}

                <div className="space-y-4">

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onKeyDown={handleKeyDown}
                        className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 w-full p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onKeyDown={handleKeyDown}
                        className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 w-full p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={login}
                        disabled={loading}
                        className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900 disabled:text-slate-400 text-black p-3 rounded-md text-sm font-medium transition-colors"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default AdminLogin;