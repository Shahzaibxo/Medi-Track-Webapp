import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { CreateMedicineForm } from "../components/forms/CreateMedicineForm";
import { CreateStripForm } from "../components/forms/CreateStripForm";
import { useMedicines } from "../hooks/useMedicines";
import { useToast } from "../components/ui/Toast";
import { CreateMedicineRequest } from "../types";
import {
  Plus,
  Search,
  MoreVertical,
  Building,
  Calendar,
  AlertCircle,
  RefreshCw,
  Package,
} from "lucide-react";

const MedicinesPage: React.FC = () => {
  const { 
    medicines, 
    addMedicine, 
    loading, 
    error, 
    clearError,
    fetchMedicines 
  } = useMedicines();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateStripForm, setShowCreateStripForm] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
  const [selectedMedicineForStrip, setSelectedMedicineForStrip] = useState<{id: string, name: string} | null>(null);
  const navigate = useNavigate();
  const { addToast, ToastContainer } = useToast();

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.company.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleCreateStrip = (medicineId: string, medicineName: string) => {
    setSelectedMedicineForStrip({ id: medicineId, name: medicineName });
    setShowCreateStripForm(true);
  };


  const handleStripCreated = () => {
    // Refresh medicines list or show success message
    addToast({
      type: 'success',
      title: 'Strip Created',
      message: 'Strip has been created successfully!'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCreateMedicine = async (medicineData: CreateMedicineRequest, imageFile: File) => {
    try {
      await addMedicine(medicineData, imageFile);
      setShowCreateForm(false);
      
      // Show success toast
      addToast({
        type: 'success',
        title: 'Medicine Added',
        message: `${medicineData.name} has been added to your inventory.`
      });
    } catch (error) {
      // Error handling is done in the form component
      console.error('Error creating medicine:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchMedicines();
      addToast({
        type: 'success',
        title: 'Refreshed',
        message: 'Medicine list has been updated.'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh medicine list.'
      });
    }
  };

  return (
    <div className="min-h-screen">
      <ToastContainer />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medicines</h1>
              <p className="mt-2 text-gray-600">
                Manage your medicine inventory
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-5 w-5" />
                Create Medicine
              </Button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="flex-1">
                <p className="text-red-700 font-medium">Error loading medicines</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <Button
                onClick={clearError}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

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

        {/* Loading State */}
        {loading && medicines.length === 0 && (
          <div className="text-center py-12">
            <RefreshCw className="h-16 w-16 text-gray-300 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading medicines...
            </h3>
            <p className="text-gray-500">Please wait while we fetch your data</p>
          </div>
        )}

        {/* Medicines Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine) => {

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
                    {medicine.image && (
                      <div className="mb-3">
                        <img 
                          src={`data:image/jpeg;base64,${medicine.image}`}
                          alt={medicine.name}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    <p className="text-gray-600 text-sm">
                      {medicine.formula}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      {medicine.company}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Added {formatDate(medicine.createdAt)}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMedicines.length === 0 && (
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

        {/* Create Strip Form */}
        {showCreateStripForm && selectedMedicineForStrip && (
          <CreateStripForm
            medicineId={selectedMedicineForStrip.id}
            medicineName={selectedMedicineForStrip.name}
            onClose={() => {
              setShowCreateStripForm(false);
              setSelectedMedicineForStrip(null);
            }}
            onSuccess={handleStripCreated}
          />
        )}

      </main>
    </div>
  );
};

export default MedicinesPage;
