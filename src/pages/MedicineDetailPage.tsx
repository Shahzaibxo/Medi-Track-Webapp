import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CreateStripForm } from '../components/forms/CreateStripForm';
import { StripDetailModal } from '../components/StripDetailModal';
import { useToast } from '../components/ui/Toast';
import { stripService } from '../services/ApiClient';
import { useMedicines } from '../hooks/useMedicines';
import {
  ArrowLeft,
  Plus,
  Building,
  Calendar,
  Package,
  Hash,
  RefreshCw,
  AlertCircle,
  DollarSign
} from 'lucide-react';

interface Strip {
  id: string;
  stripCode: string;
  power: number;
  price: number;
  batchNumber: string;
  expiryDate: string;
  manufacturingDate: string;
  status: string;
  description?: string;
}

const MedicineDetailPage: React.FC = () => {
  const { medicineId } = useParams<{ medicineId: string }>();
  const navigate = useNavigate();
  const { getMedicineById } = useMedicines();
  const { addToast, ToastContainer } = useToast();
  
  const [medicine, setMedicine] = useState<any>(null);
  const [strips, setStrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stripsLoading, setStripsLoading] = useState(false);
  const [showCreateStripForm, setShowCreateStripForm] = useState(false);
  const [showStripModal, setShowStripModal] = useState(false);
  const [selectedStrip, setSelectedStrip] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStrips = useCallback(async () => {
    console.log('loadStrips function called with medicineId:', medicineId);
    if (!medicineId) {
      console.log('No medicineId, returning early');
      return;
    }
    
    setStripsLoading(true);
    try {
      console.log('Loading strips for medicine ID:', medicineId);
      const response = await stripService.getStripsByMedicine(medicineId);
      console.log('Strips API response:', response);
      setStrips(response.data || []);
    } catch (error: any) {
      console.error('Error loading strips:', error);
      addToast({
        type: 'error',
        title: 'Error Loading Strips',
        message: error.message || 'Failed to load strips'
      });
    }
    setStripsLoading(false);
  }, [medicineId, addToast]);

  // Load medicine data
  useEffect(() => {
    console.log('useEffect triggered with medicineId:', medicineId);
    if (medicineId) {
      const medicineData = getMedicineById(medicineId);
      console.log('Found medicine data:', medicineData);
      if (medicineData) {
        setMedicine(medicineData);
        console.log('Calling loadStrips...');
        loadStrips();
      } else {
        console.log('Medicine not found');
        setError('Medicine not found');
      }
    }
  }, [medicineId, getMedicineById, loadStrips]);

  const handleCreateStrip = (medicineId: string, medicineName: string) => {
    console.log('=== NAVIGATING TO STRIPS PAGE ===');
    console.log('Medicine ID:', medicineId);
    console.log('Medicine Name:', medicineName);
    navigate(`/medicines/${medicineId}/strips`);
  };

  const handleStripCreated = () => {
    // Refresh strips list
    loadStrips();
    addToast({
      type: 'success',
      title: 'Strip Created',
      message: 'Strip has been created successfully!'
    });
  };

  const handleStripClick = async (strip: any) => {
    try {
      console.log('Strip clicked:', strip);
      console.log('Fetching strip details for code:', strip.alphaNumericCode);
      
      const response = await stripService.getStripByCode(strip.alphaNumericCode);
      console.log('Strip details API response:', response);
      
      setSelectedStrip(response.data);
      setShowStripModal(true);
    } catch (error: any) {
      console.error('Error fetching strip details:', error);
      addToast({
        type: 'error',
        title: 'Error Loading Strip Details',
        message: error.message || 'Failed to load strip details'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'recalled':
        return 'bg-orange-100 text-orange-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Medicine Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/medicines')}>
            Back to Medicines
          </Button>
        </Card>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-16 w-16 text-gray-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ToastContainer />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate('/medicines')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Medicines
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{medicine.name}</h1>
              <p className="mt-2 text-gray-600">{medicine.formula}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => loadStrips()}
                variant="outline"
                disabled={stripsLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${stripsLoading ? 'animate-spin' : ''}`} />
                Refresh Strips
              </Button>
            </div>
          </div>
        </div>

        {/* Medicine Info Card */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {medicine.image && (
                <img 
                  src={`data:image/jpeg;base64,${medicine.image}`}
                  alt={medicine.name}
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Building className="h-5 w-5 mr-3" />
                <span className="font-medium">Company:</span>
                <span className="ml-2">{medicine.company}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-3" />
                <span className="font-medium">Added:</span>
                <span className="ml-2">{formatDate(medicine.createdAt)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Add Strip Button - Middle of the page */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => handleCreateStrip(medicine.id, medicine.name)}
            className="flex items-center gap-2 px-8 py-3"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Add New Strip
          </Button>
        </div>

        {/* Debug Section - Remove this after debugging */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Info</h3>
          <p className="text-sm text-yellow-700">Medicine ID: {medicineId}</p>
          <p className="text-sm text-yellow-700">Strips Count: {strips.length}</p>
          <p className="text-sm text-yellow-700">Loading: {stripsLoading ? 'Yes' : 'No'}</p>
          <div className="flex gap-2 mt-2">
            <Button
              onClick={loadStrips}
              size="sm"
            >
              Test Load Strips
            </Button>
            <Button
              onClick={async () => {
                if (!medicineId) return;
                try {
                  console.log('Testing strips API directly...');
                  const response = await stripService.getStripsByMedicine(medicineId!);
                  console.log('Direct strips API response:', response);
                } catch (error) {
                  console.error('Direct strips API error:', error);
                }
              }}
              size="sm"
              variant="outline"
            >
              Test Strips API Direct
            </Button>
          </div>
        </div>

        {/* Strips Listing */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Strips ({strips.length})</h2>
          </div>
          
          {stripsLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-16 w-16 text-gray-300 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading strips...</h3>
            </div>
          ) : strips.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No strips found</h3>
              <p className="text-gray-500">Create your first strip for this medicine</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {strips.map((strip) => (
                <Card
                  key={strip.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 p-4"
                  onClick={() => handleStripClick(strip)}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                      {strip.alphaNumericCode}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Strip Code
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Create Strip Form */}
        {showCreateStripForm && (() => {
          console.log('=== RENDERING CREATE STRIP FORM ===');
          return (
            <CreateStripForm
              medicineId={medicine.id}
              medicineName={medicine.name}
              onClose={() => setShowCreateStripForm(false)}
              onSuccess={handleStripCreated}
            />
          );
        })()}

        {/* Strip Detail Modal */}
        {showStripModal && selectedStrip && (
          <StripDetailModal
            strip={selectedStrip}
            onClose={() => {
              setShowStripModal(false);
              setSelectedStrip(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default MedicineDetailPage;
