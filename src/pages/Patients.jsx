import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Patients() {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        const response = await API.get("/patients");
        setPatients(response.data);
    };

    return (
        <div>
            <Navbar />

            <div className="p-8">
                <h2 className="text-3xl font-bold mb-6">Patients</h2>

                <div className="grid gap-4">
                    {patients.map((patient) => (
                        <div
                            key={patient.patientId}
                            className="bg-white shadow-md p-4 rounded-lg"
                        >
                            <h3 className="text-xl font-bold">
                                {patient.fullName}
                            </h3>
                            <p>Age: {patient.age}</p>
                            <p>Gender: {patient.gender}</p>
                            <p>Contact: {patient.contactNumber}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Patients;