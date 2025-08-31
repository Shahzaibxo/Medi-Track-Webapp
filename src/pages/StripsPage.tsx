import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { AddStripForm } from "../components/forms/AddStripForm";
import { useMedicines } from "../hooks/useMedicines";
import { Medicine, Strip } from "../types";
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  DollarSign,
  Hash,
  Plus,
} from "lucide-react";

const StripsPage = () => {
  const { medicineId } = useParams<{ medicineId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getMedicineById, getStripsByMedicine, addStrip } = useMedicines();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [strips, setStrips] = useState<Strip[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (medicineId) {
      const foundMedicine = getMedicineById(medicineId);
      const medicineStrips = getStripsByMedicine(medicineId);

      setMedicine(foundMedicine || null);
      setStrips(medicineStrips);

      // Check if coming from add action
      const params = new URLSearchParams(location.search);
      if (params.get("action") === "add") {
        setShowAddForm(true);
      }
    }
  }, [medicineId, location.search, getMedicineById, getStripsByMedicine]);

  const handleStripClick = (stripId: string) => {
    navigate(`/strips/${stripId}`);
  };

  const getStatusBadge = (status: Strip["status"]) => {
    switch (status) {
      case "available":
        return <Badge variant="success">Available</Badge>;
      case "low-stock":
        return <Badge variant="warning">Low Stock</Badge>;
      case "out-of-stock":
        return <Badge variant="error">Out of Stock</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAddStrip = (stripData: Parameters<typeof addStrip>[0]) => {
    const newStrip = addStrip(stripData);
    setStrips((prev) => [...prev, newStrip]);
    setShowAddForm(false);
  };

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Medicine not found
            </h3>
            <Button onClick={() => navigate("/medicines")} className="mt-4">
              Back to Medicines
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/medicines")}
            className="mb-4 flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Medicines
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                {medicine.image && (
                  <img 
                    src={`data:image/jpeg;base64,${medicine.image}`}
                    alt={medicine.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {medicine.name}
                  </h1>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span>Company: {typeof medicine.company === 'object' ? (medicine.company as { companyName: string }).companyName : medicine.company}</span>
                    <span>•</span>
                    <span>Total Strips: {strips.length}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              Add Strip
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strips.map((strip) => (
            <Card
              key={strip.id}
              hover
              onClick={() => handleStripClick(strip.id)}
              className="p-6"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    {strip.batchNumber}
                  </h3>
                  {getStatusBadge(strip.status)}
                </div>
                <p className="text-sm text-gray-600">
                  Quantity: {strip.quantity} units
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-4">
                    Mfg: {formatDate(strip.manufacturingDate)}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-4">
                    Exp: {formatDate(strip.expiryDate)}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {strip.location}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />$
                  {strip.price.toFixed(2)}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Click to view details
                  </span>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {strips.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No strips available
            </h3>
            <p className="text-gray-500 mb-6">
              Add strips to track inventory for this medicine
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              Add First Strip
            </Button>
          </div>
        )}

        {/* Add Strip Form */}
        {showAddForm && (
          <AddStripForm
            medicineId={medicine.id}
            medicineName={medicine.name}
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddStrip}
          />
        )}
      </main>
    </div>
  );
};

export default StripsPage;
