import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { CreateMedicineForm } from "../components/forms/CreateMedicineForm";
import { useMedicines } from "../hooks/useMedicines";
import {
  Plus,
  Search,
  MoreVertical,
  Package,
  Building,
  Calendar,
} from "lucide-react";

const MedicinesPage: React.FC = () => {
  const { medicines, addMedicine } = useMedicines();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMedicineClick = (medicineId: string) => {
    navigate(`/medicines/${medicineId}/strips`);
  };

  const handleMenuClick = (e: React.MouseEvent, medicineId: string) => {
    e.stopPropagation();
    setSelectedMedicine(selectedMedicine === medicineId ? null : medicineId);
  };

  const handleAddStrips = (medicineId: string) => {
    navigate(`/medicines/${medicineId}/strips?action=add`);
    setSelectedMedicine(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStockStatus = (stripCount: number) => {
    if (stripCount > 50)
      return { variant: "success" as const, text: "Good Stock" };
    if (stripCount > 20)
      return { variant: "warning" as const, text: "Low Stock" };
    return { variant: "error" as const, text: "Critical" };
  };

  const handleCreateMedicine = (
    medicineData: Parameters<typeof addMedicine>[0]
  ) => {
    addMedicine(medicineData);
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen ">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medicines</h1>
              <p className="mt-2 text-gray-600">
                Manage your medicine inventory
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              Create Medicine
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((medicine) => {
            const stockStatus = getStockStatus(medicine.stripCount);

            return (
              <Card
                key={medicine.id}
                hover
                onClick={() => handleMedicineClick(medicine.id)}
                className="relative p-6"
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => handleMenuClick(e, medicine.id)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>

                  {selectedMedicine === medicine.id && (
                    <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => handleAddStrips(medicine.id)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Add New Strips
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
                    {medicine.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {medicine.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    {medicine.manufacturer}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="h-4 w-4 mr-2" />
                    {medicine.dosageForm} - {medicine.strength}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Added {formatDate(medicine.createdAt)}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">
                        Strips Available
                      </span>
                      <p className="font-semibold text-gray-900">
                        {medicine.stripCount}
                      </p>
                    </div>
                    <Badge variant={stockStatus.variant}>
                      {stockStatus.text}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No medicines found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating your first medicine"}
            </p>
          </div>
        )}

        {/* Create Medicine Form */}
        {showCreateForm && (
          <CreateMedicineForm
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreateMedicine}
          />
        )}
      </main>
    </div>
  );
};

export default MedicinesPage;
