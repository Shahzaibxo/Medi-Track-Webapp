// src/components/About.js
import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen px-6 sm:px-10 lg:px-20 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12">
          About <span className="text-emerald-700">MediTrack</span>
        </h1>

        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-black/80">
            Introduction:
          </h2>
          <p className="text-base leading-relaxed mb-4 text-justify">
            Counterfeit medicines are a serious global issue that directly
            affects public health, especially in developing countries. Without a
            secure verification system, fake drugs easily enter the market,
            leading to treatment failures, prolonged illnesses, and preventable
            deaths.
          </p>
          <p className="text-base leading-relaxed text-justify">
            Our proposed system, built on blockchain technology, aims to ensure
            end-to-end medicine authenticity verification through tamper-proof
            records and QR code scanning, enabling manufacturers, distributors,
            pharmacies, regulators, and consumers to track medicines throughout
            their lifecycle.
          </p>
        </section>

        {/* Problem Statement */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-black/80">
            Problem Statement
          </h2>
          <h3 className="text-lg font-medium mb-3 text-emerald-600">
            Current Drawbacks in Society
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>
              <span className="text-emerald-600 font-medium">
                High Circulation of Counterfeit Medicines
              </span>{" "}
              - Fake drugs are sold in markets without detection.
            </li>
            <li>
              <span className="text-emerald-600 font-medium">
                Lack of Transparency in Supply Chains
              </span>{" "}
              - Consumers cannot verify where the medicine comes from.
            </li>
            <li>
              <span className="text-emerald-600 font-medium">
                Centralized & Corruptible Systems
              </span>{" "}
              - Existing tracking methods can be manipulated.
            </li>
            <li>
              <span className="text-emerald-600 font-medium">
                Weak Regulatory Monitoring
              </span>{" "}
              - Authorities rely on manual checks which are slow and
              ineffective.
            </li>
            <li>
              <span className="text-emerald-600 font-medium">
                No Real-Time Alerts
              </span>{" "}
              - Consumers only find out about expired or recalled medicines
              after harm is done.
            </li>
          </ul>
        </section>

        {/* Objectives */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-black/80">
            Objectives
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-base">
            <li>
              <span className="text-emerald-600 font-medium">
                Primary Objective:
              </span>{" "}
              Develop a blockchain-based system that verifies medicine
              authenticity from manufacturing to consumption.
            </li>
            <li>
              <strong className="text-emerald-600 font-medium">
                Secondary Objectives:
              </strong>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide tamper-proof supply chain records.</li>
                <li>Offer instant verification through QR code scanning.</li>
                <li>
                  Enable real-time alerts for expired or recalled medicines.
                </li>
                <li>
                  Integrate with regulatory authorities for automated
                  compliance.
                </li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Purpose */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-black/80">
            Purpose
          </h2>
          <p className="text-base mb-3">The proposed system will:</p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>
              Enhance public health safety by reducing counterfeit drug use.
            </li>
            <li>Protect the brand reputation of pharmaceutical companies.</li>
            <li>Build consumer trust through transparency.</li>
            <li>Enable faster, data-driven regulation.</li>
          </ul>
        </section>

        {/* Back Button */}
        <div className="text-left">
          <Link to="/">
            <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md transition duration-300 cursor-pointer">
              <i className="fas fa-arrow-left mr-2"></i> Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
