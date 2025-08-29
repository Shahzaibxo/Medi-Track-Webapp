import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useMedicines } from "../hooks/useMedicines";
import { StripDetail, Medicine } from "../types";
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  DollarSign,
  Hash,
  Building,
  FileText,
  BarChart3,
  Edit,
  Trash2,
} from "lucide-react";

const StripDetailPage = () => {
  const { stripId } = useParams<{ stripId: string }>();
  const navigate = useNavigate();
  const { getStripById, getMedicineById } = useMedicines();
  const [strip, setStrip] = useState<StripDetail | null>(null);
  const [medicine, setMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    if (stripId) {
      const foundStrip = getStripById(stripId);

      if (foundStrip) {
        // Convert Strip to StripDetail with additional fields
        const stripDetail: StripDetail = {
          ...foundStrip,
          barcode: `BC-${foundStrip.id.toUpperCase()}-${
            foundStrip.batchNumber
          }`,
          supplier: "MedSupply International",
          notes: "Store in cool, dry place. Keep away from direct sunlight.",
          lastUpdated: new Date().toISOString(),
        };
        setStrip(stripDetail);

        const relatedMedicine = getMedicineById(foundStrip.medicineId);
        setMedicine(relatedMedicine || null);
      }
    }
  }, [stripId, getStripById, getMedicineById]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: StripDetail["status"]) => {
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

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!strip || !medicine) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Strip not found
            </h3>
            <Button
              onClick={() => navigate("/medicines")}
              className="mt-4 cursor-pointer"
            >
              Back to Medicines
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const daysUntilExpiry = getDaysUntilExpiry(strip.expiryDate);
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry <= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(`/medicines/${medicine.id}/strips`)}
            className="mb-4 flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Strips
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Strip Details
              </h1>
              <p className="mt-2 text-gray-600">{medicine.name}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="danger"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Basic Information
                </h2>
                {getStatusBadge(strip.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Batch Number
                    </label>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <span className="font-mono text-gray-900">
                        {strip.batchNumber}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Barcode
                    </label>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-gray-400" />
                      <span className="font-mono text-sm text-gray-900">
                        {strip.barcode}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {strip.quantity} units
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Price
                    </label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        ${strip.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Manufacturing Date
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {formatDate(strip.manufacturingDate)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Expiry Date
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span
                        className={`text-gray-900 ${
                          isExpired
                            ? "text-red-600"
                            : isExpiringSoon
                            ? "text-yellow-600"
                            : ""
                        }`}
                      >
                        {formatDate(strip.expiryDate)}
                      </span>
                    </div>
                    {isExpired && (
                      <p className="text-sm text-red-600 mt-1">Expired</p>
                    )}
                    {isExpiringSoon && !isExpired && (
                      <p className="text-sm text-yellow-600 mt-1">
                        Expires in {daysUntilExpiry} days
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Location
                    </label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{strip.location}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Supplier
                    </label>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{strip.supplier}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Additional Notes
              </h2>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-gray-600 leading-relaxed">{strip.notes}</p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Medicine Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Name</span>
                  <p className="font-medium text-gray-900">{medicine.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Manufacturer</span>
                  <p className="text-gray-900">{medicine.manufacturer}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Category</span>
                  <p className="text-gray-900">{medicine.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Strength</span>
                  <p className="text-gray-900">{medicine.strength}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Last Updated
              </h3>
              <p className="text-gray-600">
                {formatDateTime(strip.lastUpdated)}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  Update Quantity
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  Change Location
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  Print Label
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StripDetailPage;
