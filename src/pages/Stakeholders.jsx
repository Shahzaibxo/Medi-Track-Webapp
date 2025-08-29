// src/components/Stakeholders.js
import React from "react";
import { Link } from "react-router";

const Stakeholders = () => {
  const stakeholders = [
    {
      icon: "fas fa-industry",
      name: "Pharmaceutical Companies",
      role: "Register batches on blockchain",
    },
    {
      icon: "fas fa-truck",
      name: "Distributors",
      role: "Receive and forward batches",
    },
    {
      icon: "fas fa-prescription-bottle-alt",
      name: "Pharmacies",
      role: "Sell verified medicines",
    },
    {
      icon: "fas fa-user",
      name: "Consumers",
      role: "Verify authenticity via QR codes",
    },
    {
      icon: "fas fa-shield-alt",
      name: "Regulatory Authorities",
      role: "Monitor compliance in real time",
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-10 text-black/80">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-black mb-6">
        <span className="text-emerald-700">System</span> Stakeholders
      </h1>
      <p className="text-center text-gray-600 text-base sm:text-lg mb-10 max-w-2xl mx-auto">
        Our platform connects all participants in the pharmaceutical supply
        chain to ensure transparency and trust.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stakeholders.map((stakeholder, index) => (
          <div
            key={index}
            className="stakeholder-card bg-gray-50 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center text-center"
          >
            <div className="stakeholder-icon text-[#1E3A8A] text-4xl sm:text-5xl mb-4">
              <i className={stakeholder.icon}></i>
            </div>
            <div className="stakeholder-name font-semibold text-lg sm:text-xl text-gray-800 mb-2">
              {stakeholder.name}
            </div>
            <div className="stakeholder-role text-gray-600 text-sm sm:text-base">
              {stakeholder.role}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Link to="/">
          <button className="btn bg-emerald-600 text-white px-8 py-2.5 rounded-lg shadow hover:bg-emerald-700 cursor-pointer transition flex items-center gap-2">
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Stakeholders;
