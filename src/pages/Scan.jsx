// src/components/Scan.js
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Scan = ({ showScreen, setMedicineData }) => {
  const [batchId, setBatchId] = useState("");
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      setBatchId(data);
      checkMedicine(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const checkMedicine = (id) => {
    const batchIdToCheck = id || batchId;

    if (!batchIdToCheck) {
      alert("Please enter a Batch ID or scan a QR code");
      return;
    }

    // Demo data - replace with actual API call
    let medicineData;
    const idUpper = batchIdToCheck.trim().toUpperCase();

    if (idUpper === "BATCH123") {
      medicineData = {
        name: "Paracetamol 500mg",
        batchNumber: "BATCH123",
        manufacturer: "HealthPlus Pharmaceuticals",
        productionDate: "2023-01-15",
        expiryDate: "2025-01-14",
        currentOwner: "City Pharmacy, Karachi",
        status: "ok",
        statusText: "Genuine & Safe",
        trail: [
          { action: "Manufacturer → Registered", date: "2023-01-15 09:30" },
          { action: "Quality Control → Approved", date: "2023-01-20 14:15" },
          {
            action: "Distributor → Shipped to Regional Warehouse",
            date: "2023-02-01 11:00",
          },
          { action: "Regional Warehouse → Received", date: "2023-02-03 16:45" },
          { action: "Pharmacy → Stocked", date: "2023-02-10 10:20" },
          {
            action: "Consumer → Verified",
            date: new Date().toISOString().slice(0, 16).replace("T", " "),
          },
        ],
      };
    } else if (idUpper === "BATCH999") {
      medicineData = {
        name: "Ibuprofen 200mg",
        batchNumber: "BATCH999",
        manufacturer: "MediCare Labs",
        productionDate: "2021-05-10",
        expiryDate: "2023-05-09",
        currentOwner: "Unknown",
        status: "bad",
        statusText: "Expired",
        trail: [
          { action: "Manufacturer → Registered", date: "2021-05-10 08:00" },
          { action: "Quality Control → Approved", date: "2021-05-15 13:30" },
          { action: "Distributor → Shipped", date: "2021-06-01 09:15" },
          { action: "Recall → Issued", date: "2023-05-10 10:00" },
          {
            action: "Warning → Expired Product",
            date: new Date().toISOString().slice(0, 16).replace("T", " "),
          },
        ],
      };
    } else if (idUpper === "BATCH456") {
      medicineData = {
        name: "Amoxicillin 250mg",
        batchNumber: "BATCH456",
        manufacturer: "PharmaTrust Inc.",
        productionDate: "2023-03-01",
        expiryDate: "2025-03-01",
        currentOwner: "Community Drugstore, Lahore",
        status: "warn",
        statusText: "Potential Counterfeit",
        trail: [
          { action: "Manufacturer → Registered", date: "2023-03-01 10:00" },
          { action: "Quality Control → Approved", date: "2023-03-05 15:30" },
          { action: "Distributor → Shipped", date: "2023-03-10 11:45" },
          {
            action: "Warning → Suspicious Activity Detected",
            date: "2023-03-12 14:20",
          },
          {
            action: "Verification → Requires Further Inspection",
            date: new Date().toISOString().slice(0, 16).replace("T", " "),
          },
        ],
      };
    } else {
      medicineData = {
        name: "Unknown Product",
        batchNumber: idUpper,
        manufacturer: "Unknown",
        productionDate: "-",
        expiryDate: "-",
        currentOwner: "Unknown",
        status: "bad",
        statusText: "Not Found (Possible Fake)",
        trail: [
          {
            action: "Warning → Batch ID not registered in system",
            date: new Date().toISOString().slice(0, 16).replace("T", " "),
          },
        ],
      };
    }

    setMedicineData(medicineData);
    showScreen("result");
    navigate("/result");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-black px-6 sm:px-10 lg:px-20 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
          <span className="text-emerald-700">Medicine</span> Verification
        </h1>
        <p className="text-base sm:text-lg mb-8 leading-relaxed">
          Scan the QR code on your medicine packaging to verify its authenticity
          and view its complete history.
        </p>

        {/* QR Scanner */}
        {scanning ? (
          <div className="w-full max-w-md mx-auto mb-6">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            />
            <button
              className="w-full mt-4 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-semibold shadow-md transition duration-300 cursor-pointer"
              onClick={() => setScanning(false)}
            >
              <i className="fas fa-times mr-2"></i> Cancel Scan
            </button>
          </div>
        ) : (
          <button
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold shadow-md transition duration-300 mb-6 cursor-pointer text-white"
            onClick={() => setScanning(true)}
          >
            <i className="fas fa-qrcode mr-2"></i> Start QR Scanner
          </button>
        )}

        {/* Manual Entry */}
        <div className="bg-gray-200 p-10 rounded-xl shadow-lg mb-8">
          <p className="mb-3 text-lg font-medium text-black/60">
            Or enter the Batch ID manually:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="Enter Batch ID (e.g. BATCH123)"
              className="flex-1 px-4 py-2 rounded-lg text-black outline-1 focus:outline-black-500 focus:ring-2 focus:ring-emerald-500"
            />
            <button
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold shadow-md transition duration-300 cursor-pointer text-white"
              onClick={() => checkMedicine()}
            >
              <i className="fas fa-search mr-2"></i> Verify
            </button>
          </div>
        </div>

        {/* Back Button */}
        <Link to="/">
          <button className="px-6 py-3 border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg font-semibold transition duration-300 cursor-pointer">
            <i className="fas fa-arrow-left mr-2"></i> Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Scan;
