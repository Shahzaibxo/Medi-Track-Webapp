import { Navigate, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import React from "react";
import Footer from "./components/Footer";
import Scan from "./pages/Scan";
import Stakeholders from "./pages/Stakeholders";
import Features from "./pages/Features";
import { LoginPage } from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import MedicinesPage from "./pages/MedicinesPage";
import StripsPage from "./pages/StripsPage";
import StripDetailPage from "./pages/StripDetailPage";

const App = () => {
  return (
    <AuthProvider>
      <div className="flex-1 flex-col min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/stakeholders" element={<Stakeholders />} />
          <Route path="/features" element={<Features />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/medicines"
            element={
              <ProtectedRoute>
                <MedicinesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicines/:medicineId/strips"
            element={
              <ProtectedRoute>
                <StripsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/strips/:stripId"
            element={
              <ProtectedRoute>
                <StripDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/medicines" replace />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
