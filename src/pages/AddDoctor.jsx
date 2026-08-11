import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const FIELDS = [
    { name: "fullName", label: "Full name", type: "text", placeholder: "Dr. Ayesha Fernando" },
    { name: "email", label: "Email", type: "email", placeholder: "ayesha.fernando@opd.lk" },
    { name: "password", label: "Password", type: "password", placeholder: "Temporary password" },
    { name: "specialization", label: "Specialization", type: "text", placeholder: "Cardiology" },
    { name: "contactNumber", label: "Contact number", type: "text", placeholder: "+94 71 234 5678" },
];

function AddDoctor() {
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState({
        fullName: "",
        email: "",
        password: "",
        specialization: "",
        contactNumber: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setDoctor({
            ...doctor,
            [e.target.name]: e.target.value,
        });
    };

    const saveDoctor = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            await API.post("/admin/users", {
                ...doctor,
                role: "Doctor",
            });

            alert("Doctor added successfully.");

            navigate("/view-users");
        } catch (error) {
            console.error(error);

            alert("Failed to add doctor.");
        }

        setLoading(false);
    };

    const fonts = (
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
            .ad-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
            .ad-body { font-family: 'IBM Plex Sans', sans-serif; }
            .ad-mono { font-family: 'IBM Plex Mono', monospace; }
            .ad-input {
                font-family: 'IBM Plex Sans', sans-serif;
                border: 1px solid #E4DFD1;
                background: #FBFAF7;
            }
            .ad-input:focus {
                outline: none;
                border-color: #1C6E74;
                background: #FFFFFF;
                box-shadow: 0 0 0 3px rgba(28, 110, 116, 0.12);
            }
        `}</style>
    );

    return (
        <div className="ad-body min-h-screen bg-[#F6F4EF]">
            {fonts}

            {/* Header */}
            <div className="bg-[#0E4548] text-white">
                <div className="max-w-5xl mx-auto px-8 py-6">
                    <button
                        onClick={() => navigate("/admin-dashboard")}
                        className="ad-mono text-xs uppercase tracking-wide text-[#9FC7C4] hover:text-white transition-colors mb-4 inline-flex items-center gap-1.5"
                    >
                        ← Dashboard
                    </button>

                    <div className="flex items-center gap-4">
                        <div
                            className="ad-mono flex items-center justify-center h-11 w-11 rounded-lg text-sm font-medium shrink-0"
                            style={{ backgroundColor: "#E4F0EF", color: "#1C6E74" }}
                        >
                            DR
                        </div>
                        <div>
                            <p className="ad-mono text-[11px] tracking-[0.2em] uppercase text-[#9FC7C4] mb-1">
                                New registration
                            </p>
                            <h1 className="ad-display text-2xl text-white leading-tight">
                                Add doctor
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto px-8 py-10">
                <div className="bg-white rounded-2xl border border-[#E4DFD1] p-8">
                    <form onSubmit={saveDoctor}>
                        <div className="grid sm:grid-cols-2 gap-5">
                            {FIELDS.map((field) => (
                                <div
                                    key={field.name}
                                    className={
                                        field.name === "fullName" || field.name === "email"
                                            ? "sm:col-span-2"
                                            : ""
                                    }
                                >
                                    <label className="block text-[11px] uppercase tracking-widest text-[#16302F]/50 mb-2">
                                        {field.label}
                                    </label>

                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={doctor[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        required
                                        className="ad-input w-full rounded-lg px-4 py-3 text-[15px] text-[#16302F] placeholder:text-[#16302F]/30 transition-shadow"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-8 pt-6 border-t border-[#E4DFD1]">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-[#1C6E74] hover:bg-[#0E4548] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                {loading ? "Saving…" : "Save doctor"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin-dashboard")}
                                className="flex-1 border border-[#E4DFD1] hover:border-[#C9C2AE] hover:bg-[#F6F4EF] text-[#16302F] py-3 rounded-lg font-medium transition-colors"
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

export default AddDoctor;