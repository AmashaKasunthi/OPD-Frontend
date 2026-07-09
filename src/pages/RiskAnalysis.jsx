import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function RiskAnalysis() {

    const { patientId } = useParams();
    const navigate = useNavigate();

    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadResult();
    }, []);

    const loadResult = async () => {

        try {

            const response = await API.get(
                `/medical-records/patient/${patientId}`
            );

            setRecord(response.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <>
                <Navbar />
                <div className="p-10 text-center">
                    Loading AI Result...
                </div>
            </>
        );

    }

    if (!record) {

        return (
            <>
                <Navbar />

                <div className="p-10 text-center">

                    <h2 className="text-2xl font-bold">
                        No AI Result Found
                    </h2>

                </div>
            </>
        );

    }

    return (

        <div className="min-h-screen bg-[#F8F8F8]">

            <Navbar />

            <div className="max-w-5xl mx-auto p-8">

                <h1 className="text-3xl font-bold mb-8">

                     Risk Analysis

                </h1>

                <div className="bg-white rounded-xl shadow-lg p-8">

                    <div className="grid grid-cols-2 gap-6">

                        <div>

                            <h3 className="font-semibold text-gray-600">

                                Symptoms

                            </h3>

                            <p>{record.symptoms}</p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-gray-600">

                                Blood Pressure

                            </h3>

                            <p>{record.bloodPressure}</p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-gray-600">

                                Temperature

                            </h3>

                            <p>{record.temperature} °C</p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-gray-600">

                                Heart Rate

                            </h3>

                            <p>{record.heartRate} BPM</p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-gray-600">

                                Weight

                            </h3>

                            <p>{record.weight} kg</p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-gray-600">

                                Notes

                            </h3>

                            <p>{record.notes}</p>

                        </div>

                    </div>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold text-[#1C6E74] mb-6">

                        AI Prediction

                    </h2>

                    <div className="space-y-6">

                        <div>

                            <h3 className="font-semibold">

                                Predicted Disease

                            </h3>

                            <p className="text-lg">

                                {record.predictedDisease}

                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold">

                                Risk Level

                            </h3>

                            <span
                                className={`px-4 py-2 rounded-full text-white font-semibold ${
                                    record.riskLevel === "HIGH"
                                        ? "bg-red-600"
                                        : record.riskLevel === "MEDIUM"
                                        ? "bg-yellow-500"
                                        : "bg-green-600"
                                }`}
                            >
                                {record.riskLevel}
                            </span>

                        </div>

                        <div>

                            <h3 className="font-semibold">

                                Precautions

                            </h3>

                            <p className="whitespace-pre-line">

                                {record.precautions}

                            </p>

                        </div>

                    </div>

                    <div className="mt-10">

                        <button
                            onClick={() => navigate("/doctor-dashboard")}
                            className="bg-[#1C6E74] text-white px-6 py-3 rounded-lg"
                        >

                            Back to Dashboard

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default RiskAnalysis;