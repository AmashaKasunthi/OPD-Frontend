import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Help() {
  const navigate = useNavigate();

  const helpSections = [
    {
      title: "Patient Management",
      items: [
        "Register a new patient using the Patient Registration page.",
        "View all registered patients from the Patient List.",
        "Use the Search option to quickly locate a patient.",
        "Edit or delete patient details when necessary."
      ]
    },
    {
      title: "Medical Records",
      items: [
        "Open a patient's profile and create a Medical Record.",
        "Enter symptoms, blood pressure, temperature, heart rate, weight and clinical notes.",
        "Save the medical record to generate an AI prediction.",
        "Use 'Edit Medical Record' to update information and automatically generate a new AI prediction."
      ]
    },
    {
      title: "AI Risk Analysis",
      items: [
        "The AI predicts the most likely disease based on symptoms.",
        "Risk Level is categorized as Low, Medium or High.",
        "Recommended precautions are automatically generated.",
        "Doctors should always verify AI predictions before making clinical decisions."
      ]
    },
    {
      title: "Dashboard",
      items: [
        "View total registered patients.",
        "View total OPD medical records.",
        "Access Patient List and Medical Records.",
        "Monitor recently registered patients."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold text-[#16302F] mb-2">
          Help Center
        </h1>

        <p className="text-gray-600 mb-8">
          Welcome to the OPD AI Management System. This guide explains how to
          use the system effectively.
        </p>

        {/* Quick Guide */}
        <div className="bg-[#0E4548] rounded-2xl p-8 text-white mb-8">

  <h2 className="text-2xl font-semibold mb-5">
    Quick Workflow
  </h2>

  <div className="grid md:grid-cols-6 gap-4 text-center">

    <div className="bg-white/10 rounded-xl p-4">
      <h3 className="font-semibold text-2xl mb-2">1</h3>
      <p>Register Patient</p>
    </div>

    <div className="bg-white/10 rounded-xl p-4">
      <h3 className="font-semibold text-2xl mb-2">2</h3>
      <p>Add Medical Record</p>
    </div>

    <div className="bg-white/10 rounded-xl p-4">
      <h3 className="font-semibold text-2xl mb-2">3</h3>
      <p>Generate AI Risk Analysis</p>
    </div>

    <div className="bg-white/10 rounded-xl p-4">
      <h3 className="font-semibold text-2xl mb-2">4</h3>
      <p>Review Disease & Risk Level</p>
    </div>

    <div className="bg-white/10 rounded-xl p-4">
      <h3 className="font-semibold text-2xl mb-2">5</h3>
      <p>Update Medical Record (if needed)</p>
    </div>

    <div className="bg-white/10 rounded-xl p-4">
      <h3 className="font-semibold text-2xl mb-2">6</h3>
      <p>Save Final Record</p>
    </div>

  </div>

</div>

        {/* Help Sections */}
        <div className="grid md:grid-cols-2 gap-6">

          {helpSections.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-2xl border border-[#E4DFD1] p-6"
            >
              <h2 className="text-xl font-semibold text-[#0E4548] mb-4">
                {section.title}
              </h2>

              <ul className="space-y-3">
                {section.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-[#16302F]"
                  >
                    <span className="text-green-600 font-bold">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Emergency Notice */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6">

          <h2 className="text-xl font-semibold text-red-700 mb-3">
            Important Notice
          </h2>

          <p className="text-gray-700 leading-7">
            The AI Risk Analysis module is designed to assist healthcare
            professionals. It should not replace clinical judgment.
            Always evaluate the patient's condition and confirm the AI
            prediction before making treatment decisions.
          </p>

        </div>

        {/* Contact */}
        <div className="mt-8 bg-white border border-[#E4DFD1] rounded-2xl p-6">

          <h2 className="text-xl font-semibold text-[#0E4548] mb-3">
            Need Assistance?
          </h2>

          <p className="text-gray-700">
            If you experience any issues while using the OPD AI Management
            System, please contact the system administrator or your hospital's
            IT support team.
          </p>

        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#1C6E74] hover:bg-[#15565B] text-black px-6 py-3 rounded-xl font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default Help;