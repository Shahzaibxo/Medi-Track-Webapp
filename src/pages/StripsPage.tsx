import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Global function declaration
declare global {
  interface Window {
    openDownloadModal?: (data: any) => void;
  }
}
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { stripService } from '../services/ApiClient';
import { StripDetailModal } from '../components/StripDetailModal';
import { CreateStripForm } from '../components/forms/CreateStripForm';
import { FileUploadModal } from '../components/FileUploadModal';
import { DownloadModal } from '../components/DownloadModal';
import {
  ArrowLeft,
  Package,
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Plus,
  Upload
} from 'lucide-react';

interface Strip {
  id: string;
  alphaNumericCode: string;
  blockchainTransactionId: string;
  createdAt: string;
  updatedAt: string;
  medicine: {
    id: string;
    name: string;
    formula: string;
    image: string;
    companyName: string;
  };
  blockchainData: {
    power: number;
    price: number;
    batchNumber: string;
    expiryDate: string;
    manufacturingDate: string;
    description: string;
    status: string;
    medicineId: string;
  };
}

const ITEMS_PER_PAGE = 12;

const StripsPage: React.FC = () => {
  const { medicineId } = useParams<{ medicineId: string }>();
  const navigate = useNavigate();
  const [strips, setStrips] = useState<Strip[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [medicineName, setMedicineName] = useState<string>('');
  const [selectedStrip, setSelectedStrip] = useState<Strip | null>(null);
  const [showStripDetailModal, setShowStripDetailModal] = useState(false);
  const [showCreateStripForm, setShowCreateStripForm] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadData, setDownloadData] = useState<any>(null);
  const { addToast } = useToast();

  const loadStrips = useCallback(async (page: number = 1) => {
    if (!medicineId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading strips for medicine:', medicineId, 'Page:', page);
      const response = await stripService.getStripsByMedicine(medicineId);
      console.log('Strips API response:', response);
      
      const allStrips = response.data.data || [];
      const totalItems = allStrips.length;
      const totalPagesCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
      
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedStrips = allStrips.slice(startIndex, endIndex);
      
      setStrips(paginatedStrips);
      setTotalPages(totalPagesCount);
      setCurrentPage(page);
      
      // Set medicine name from first strip if available
      if (allStrips.length > 0 && allStrips[0].medicine) {
        setMedicineName(allStrips[0].medicine.name);
      }
      
    } catch (error: any) {
      console.error('Error loading strips:', error);
      setError(error.message || 'Failed to load strips');
      addToast({
        type: 'error',
        title: 'Error Loading Strips',
        message: error.message || 'Failed to load strips'
      });
    }
    
    setLoading(false);
  }, [medicineId, addToast]);

  useEffect(() => {
    if (medicineId) {
      loadStrips(1);
    }
  }, [medicineId]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadStrips(page);
    }
  };

  const handleStripClick = (strip: Strip) => {
    setSelectedStrip(strip);
    setShowStripDetailModal(true);
  };

  const handleCloseStripDetailModal = () => {
    setShowStripDetailModal(false);
    setSelectedStrip(null);
  };

  const handleStripCreated = () => {
    setShowCreateStripForm(false);
    loadStrips(currentPage); // Refresh the strips list
    addToast({
      type: 'success',
      title: 'Strip Created',
      message: 'Strip has been created successfully!'
    });
  };

  const handleFileUploaded = () => {
    setShowFileUploadModal(false);
    loadStrips(currentPage); // Refresh the strips list
  };

  // Global function to open download modal
  React.useEffect(() => {
    window.openDownloadModal = (data: any) => {
      setDownloadData(data);
      setShowDownloadModal(true);
    };
    
    return () => {
      delete window.openDownloadModal;
    };
  }, []);

  const handleCloseDownloadModal = () => {
    setShowDownloadModal(false);
    setDownloadData(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'recalled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/medicines')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Medicines
            </Button>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowCreateStripForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Single Strip
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFileUploadModal(true)}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Strips for {medicineName || 'Medicine'}
              </h1>
              <p className="text-gray-600">Click on a strip to view details</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading strips...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <Package className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-medium">Error Loading Strips</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
            <Button onClick={() => loadStrips(currentPage)}>
              Try Again
            </Button>
          </div>
        ) : strips.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Strips Found</h3>
            <p className="text-gray-600">This medicine doesn't have any strips yet.</p>
        </div>
        ) : (
          <>
            {/* Strips Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
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
                    <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">
                      {strip.alphaNumericCode}
                  </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(strip.blockchainData.status)}`}>
                      {strip.blockchainData.status}
                    </span>
                </div>
                </Card>
              ))}
              </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
          </div>
        )}
          </>
        )}

        {/* Strip Detail Modal */}
        {showStripDetailModal && selectedStrip && (
          <StripDetailModal
            strip={selectedStrip}
            onClose={handleCloseStripDetailModal}
          />
        )}

        {/* Create Strip Form Modal */}
        {showCreateStripForm && medicineId && (
          <CreateStripForm
            medicineId={medicineId}
            medicineName={medicineName}
            onClose={() => setShowCreateStripForm(false)}
            onSuccess={handleStripCreated}
          />
        )}

        {/* File Upload Modal */}
        {showFileUploadModal && medicineId && (
          <FileUploadModal
            medicineId={medicineId}
            medicineName={medicineName}
            onClose={() => setShowFileUploadModal(false)}
            onSuccess={handleFileUploaded}
          />
        )}

        {/* Download Modal */}
        {showDownloadModal && downloadData && (
          <DownloadModal
            uploadResult={downloadData}
            onClose={handleCloseDownloadModal}
          />
        )}
      </div>
    </div>
  );
};

export default StripsPage;