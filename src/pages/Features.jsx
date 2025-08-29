// src/components/Features.js
import React from "react";
import { Link } from "react-router-dom";

const Features = () => {

  const features = [
    {
      icon: "fas fa-bell",
      title: "Expired Medicine Alerts",
      description:
        "Automatic notification to consumers & pharmacies when medicine reaches expiry date.",
    },
    {
      icon: "fas fa-exclamation-triangle",
      title: "Recall Management",
      description:
        "Broadcast urgent recall notices for unsafe medicines to all stakeholders instantly.",
    },
    {
      icon: "fas fa-robot",
      title: "AI Counterfeit Detection",
      description:
        "Detect suspicious activity patterns in supply chains using artificial intelligence.",
    },
    {
      icon: "fas fa-database",
      title: "National Database Integration",
      description:
        "Direct regulatory access to blockchain data for compliance monitoring.",
    },
    {
      icon: "fas fa-gift",
      title: "Consumer Reward System",
      description:
        "Incentives for reporting fake medicines to improve system security.",
    },
    {
      icon: "fas fa-wifi",
      title: "Offline Verification",
      description:
        "Scan without internet using last synced blockchain data for remote areas.",
    },
    {
      icon: "fas fa-language",
      title: "Multi-Language Support",
      description:
        "Accessibility for rural and diverse populations in their native languages.",
    },
    {
      icon: "fas fa-map-marker-alt",
      title: "Geo-Tagging Shipments",
      description:
        "Track location of medicines in real time throughout the supply chain.",
    },
    {
      icon: "fas fa-temperature-low",
      title: "Cold Chain Monitoring",
      description:
        "Ensure temperature-sensitive drugs stay within safe ranges during transport.",
    },
    {
      icon: "fas fa-lock",
      title: "Tamper-Evident Packaging",
      description:
        "RFID/NFC seals to detect early opening or tampering attempts.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Innovative Features
      </h1>
      <p className="text-gray-600 mb-8 text-base md:text-lg">
        Our system includes advanced capabilities to maximize safety and
        usability.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center text-center"
          >
            <div className="text-emerald-600 text-4xl mb-3">
              <i className={feature.icon}></i>
            </div>
            <div className="text-lg font-semibold mb-2">{feature.title}</div>
            <p className="text-gray-600 text-sm md:text-base">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <Link to="/">
        <button className="mt-10 px-6 py-2.5 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition flex items-center gap-2 mx-auto cursor-pointer">
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
      </Link>
    </div>
  );
};

export default Features;
