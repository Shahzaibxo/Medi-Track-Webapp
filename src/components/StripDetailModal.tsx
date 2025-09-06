import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useToast } from './ui/Toast';
import { stripService } from '../services/ApiClient';
import { 
  X, 
  Hash, 
  DollarSign, 
  Calendar, 
  Package, 
  FileText,
  Building,
  AlertCircle,
  CheckCircle,
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

interface StripDetailModalProps {
  strip: Strip;
  onClose: () => void;
}

export const StripDetailModal: React.FC<StripDetailModalProps> = ({
  strip,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleApiCall = async () => {
    setLoading(true);
    setError(null);
    setApiResponse(null);
    
    try {
      console.log('Calling API with strip code:', strip.alphaNumericCode);
      console.log('API endpoint: /strips/code/' + strip.alphaNumericCode);
      
      // Call the API with strip code as path parameter
      const response = await stripService.getStripByCode(strip.alphaNumericCode);
      
      console.log('API response:', response);
      setApiResponse(response.data);
      
      addToast({
        type: 'success',
        title: 'API Call Successful',
        message: 'Strip data retrieved successfully!'
      });
      
    } catch (error: any) {
      console.error('API call error:', error);
      setError(error.message || 'Failed to call API');
      
      addToast({
        type: 'error',
        title: 'API Call Failed',
        message: error.message || 'Failed to retrieve strip data'
      });
    }
    
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
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

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Strip Details</h2>
                <p className="text-sm text-gray-600">Code: {strip.alphaNumericCode}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Strip Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Strip Code</p>
                  <p className="font-mono font-semibold">{strip.alphaNumericCode}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-semibold">${strip.blockchainData.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Power</p>
                  <p className="font-semibold">{strip.blockchainData.power}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Batch Number</p>
                  <p className="font-semibold">{strip.blockchainData.batchNumber}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Manufacturing Date</p>
                  <p className="font-semibold">{formatDate(strip.blockchainData.manufacturingDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Expiry Date</p>
                  <p className="font-semibold">{formatDate(strip.blockchainData.expiryDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(strip.blockchainData.status).split(' ')[0]}`}></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(strip.blockchainData.status)}`}>
                    {strip.blockchainData.status}
                  </span>
                </div>
              </div>

              {strip.blockchainData.description && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm">{strip.blockchainData.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Medicine Information */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medicine Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Medicine Name</p>
                <p className="font-semibold">{strip.medicine.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Formula</p>
                <p className="font-semibold">{strip.medicine.formula}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-semibold">{strip.medicine.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created At</p>
                <p className="font-semibold">{formatDate(strip.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* API Call Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Integration</h3>
            
            <div className="space-y-4">
              <Button
                onClick={handleApiCall}
                loading={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Calling API...
                  </>
                ) : (
                  `Call API with Strip Code: ${strip.alphaNumericCode}`
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-red-700 font-medium">API Call Failed</p>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {apiResponse && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p className="text-green-700 font-medium">API Response Received</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <pre className="text-xs text-gray-700 overflow-x-auto">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};