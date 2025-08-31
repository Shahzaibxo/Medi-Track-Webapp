import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // For hamburger icons
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const Location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      {/* Top Navbar */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Left */}
            <div className="flex-shrink-0 text-2xl font-bold text-emerald-700">
              <Link to="/">
                <img src="/meditrack.png" alt="" width={100} height={100} />
              </Link>
            </div>

            {/* Center Nav Items (hidden on mobile) */}
            <nav className="hidden md:flex space-x-6 text-emerald-800 font-medium">
              <Link
                to="/"
                className={`hover:text-emerald-600 ${
                  Location.pathname === "/" ? "text-emerald-600" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`hover:text-emerald-600 ${
                  Location.pathname === "/about" ? "text-emerald-600" : ""
                }`}
              >
                About
              </Link>
              <Link
                to="/scan"
                className={`hover:text-emerald-600 ${
                  Location.pathname === "/scan" ? "text-emerald-600" : ""
                }`}
              >
                Scan
              </Link>
              <Link
                to="/stakeholders"
                className={`hover:text-emerald-600 ${
                  Location.pathname === "/stakeholders"
                    ? "text-emerald-600"
                    : ""
                }`}
              >
                Stakeholders
              </Link>
              <Link
                to="/features"
                className={`hover:text-emerald-600 ${
                  Location.pathname === "/features" ? "text-emerald-600" : ""
                }`}
              >
                Features
              </Link>
            </nav>

            {/* Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/medicines">
                    <button className="px-4 py-2 text-emerald-800 hover:text-emerald-600 font-medium cursor-pointer">
                      Company Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="px-10 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition font-medium cursor-pointer">
                      Login
                    </button>
                  </Link>
                  {/* <Link to="/signup">
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition">
                      Sign Up
                    </button>
                  </Link> */}
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(true)}
                className="text-emerald-800 focus:outline-none"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar (Mobile) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-emerald-300">
          <span className="text-lg font-bold text-emerald-700">Menu</span>
          <button onClick={() => setIsOpen(false)} className="text-emerald-800">
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex flex-col space-y-2 mt-6 px-4 text-emerald-800 font-medium">
          <Link
            to="/"
            className={`px-4 py-2.5 rounded-lg hover:bg-emerald-50 ${
              Location.pathname === "/" ? "text-emerald-600 bg-emerald-50" : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`px-4 py-2.5 rounded-lg hover:bg-emerald-50 ${
              Location.pathname === "/about"
                ? "text-emerald-600 bg-emerald-50"
                : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/scan"
            className={`px-4 py-2.5 rounded-lg hover:bg-emerald-50 ${
              Location.pathname === "/scan"
                ? "text-emerald-600 bg-emerald-50"
                : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            Scan
          </Link>
          <Link
            to="/stakeholders"
            className={`px-4 py-2.5 rounded-lg hover:bg-emerald-50 ${
              Location.pathname === "/stakeholders"
                ? "text-emerald-600 bg-emerald-50"
                : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            Stakeholders
          </Link>
          <Link
            to="/features"
            className={`px-4 py-2.5 rounded-lg hover:bg-emerald-50 ${
              Location.pathname === "/features"
                ? "text-emerald-600 bg-emerald-50"
                : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/medicines"
                className="block px-4 py-2.5 mt-4 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Company Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-4 mt-4 border-t border-emerald-100">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2.5 mb-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Overlay when sidebar open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 bg-opacity-30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
