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
import { SignupPage } from "./pages/SignupPage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import MedicinesPage from "./pages/MedicinesPage";
import MedicineDetailPage from "./pages/MedicineDetailPage";
import StripsPage from "./pages/StripsPage";

const App = () => {
  return (
    <ErrorBoundary>
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
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/medicines"
              element={
                <ProtectedRoute>
                  <MedicinesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medicines/:medicineId"
              element={
                <ProtectedRoute>
                  <MedicineDetailPage />
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
   
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
