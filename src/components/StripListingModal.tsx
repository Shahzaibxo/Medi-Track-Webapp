import React, { useState, useEffect, useCallback } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useToast } from './ui/Toast';
import { stripService } from '../services/ApiClient';
import { 
  X, 
  Package, 
  ChevronLeft, 
  ChevronRight,
  Hash,
  Loader2
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

interface StripListingModalProps {
  medicineId: string;
  medicineName: string;
  onClose: () => void;
  onStripClick: (strip: Strip) => void;
}

const ITEMS_PER_PAGE = 12;

export const StripListingModal: React.FC<StripListingModalProps> = ({
  medicineId,
  medicineName,
  onClose,
  onStripClick
}) => {
  const [strips, setStrips] = useState<Strip[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
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
  }, [medicineId]); // Only depend on medicineId, not loadStrips

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadStrips(page);
    }
  };

  const handleStripClick = (strip: Strip) => {
    onStripClick(strip);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Strips for {medicineName}</h2>
                <p className="text-sm text-gray-600">Click on a strip to view details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
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
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
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
          </div>
        </div>
      </Card>
    </div>
  );
};
