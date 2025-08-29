// src/components/Footer.jsx
import React from "react";
import { FaTwitter, FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-emerald-800 to-emerald-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between space-y-6 md:space-y-0">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">MediTrack</h2>
            <p className="mt-2 max-w-xl text-base text-white">
              Blockchain-Based Anti-Counterfeit Medicine Tracking and
              Verification System
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-6 text-emerald-700 text-xl">
            <a
              href="#"
              className="text-white hover:text-emerald-600 transition"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-white hover:text-emerald-600 transition"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-white hover:text-emerald-600 transition"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="#"
              className="text-white hover:text-emerald-600 transition"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-emerald-300 mt-6"></div>

        {/* Bottom Section */}
        <div className="mt-4 text-center text-base text-white">
          &copy; {new Date().getFullYear()} MediTrack. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
