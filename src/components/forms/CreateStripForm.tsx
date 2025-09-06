import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { CreateStripRequest, BlockchainStripData } from '../../types';
import { stripService } from '../../services/ApiClient';
import { Package, X, Calendar, DollarSign, Hash, FileText } from 'lucide-react';

interface CreateStripFormProps {
  medicineId: string;
  medicineName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateStripForm: React.FC<CreateStripFormProps> = ({ 
  medicineId, 
  medicineName, 
  onClose, 
  onSuccess 
}) => {
  console.log('=== CreateStripForm RENDERED ===');
  console.log('Props:', { medicineId, medicineName });
  
  const [formData, setFormData] = useState<BlockchainStripData>({
    power: 0,
    price: 0,
    batchNumber: '',
    expiryDate: '',
    manufacturingDate: '',
    description: '',
    status: 'active',
    stripCode: '',
    medicineId: medicineId
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const { addToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'power' || name === 'price' ? parseFloat(value) || 0 : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    console.log('Validating form with data:', formData);
    const newErrors: Record<string, string> = {};

    if (!formData.power || formData.power <= 0) {
      newErrors.power = 'Power is required and must be positive';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price is required and must be positive';
    }

    if (!formData.batchNumber?.trim()) {
      newErrors.batchNumber = 'Batch number is required';
    }

    if (!formData.stripCode?.trim()) {
      newErrors.stripCode = 'Strip code is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      }
    }

    if (!formData.manufacturingDate) {
      newErrors.manufacturingDate = 'Manufacturing date is required';
    } else {
      const manufacturingDate = new Date(formData.manufacturingDate);
      const today = new Date();
      if (manufacturingDate > today) {
        newErrors.manufacturingDate = 'Manufacturing date cannot be in the future';
      }
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form submitted!');
    console.log('Event:', e);
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      console.log('=== FORM VALIDATION FAILED ===');
      console.log('Form validation failed');
      return;
    }

    console.log('=== FORM VALIDATION PASSED ===');
    console.log('Form validation passed, starting API call...');
    setLoading(true);
    try {
      // Format dates to match API expected format (ISO string with time)
      const formattedData: BlockchainStripData = {
        ...formData,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : '',
        manufacturingDate: formData.manufacturingDate ? new Date(formData.manufacturingDate).toISOString() : '',
      };

      const requestData: CreateStripRequest = {
        medicineId: medicineId,
        blockchainData: formattedData
      };

      // Debug logging
      console.log('Sending strip creation request:', requestData);
      console.log('API endpoint: POST /strips');
      console.log('This may take up to 60 seconds due to blockchain processing...');

      // Show info toast about processing time
      addToast({
        type: 'info',
        title: 'Processing Strip Creation',
        message: 'Creating strip on blockchain. This may take up to 60 seconds...'
      });

      // Simulate progress steps
      setProcessingStep('Validating data...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('Sending to blockchain...');
      const response = await stripService.createStrip(requestData);
      
      setProcessingStep('Processing complete!');
      
      // Show success toast with API response message
      addToast({
        type: 'success',
        title: 'Strip Created Successfully!',
        message: response.data.message || `Strip for ${medicineName} has been created successfully.`
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Strip creation error:', error);
      
      // Reset processing step
      setProcessingStep('');
      
      // Check if it's a timeout error
      if (error.message?.includes('timeout') || error.message?.includes('exceeded')) {
        addToast({
          type: 'error',
          title: 'Request Timeout',
          message: 'The request took too long to complete. Please try again. Blockchain operations can be slow.'
        });
      } else {
        // Show error toast with API error message
        addToast({
          type: 'error',
          title: 'Creation Failed',
          message: error.message || 'Failed to create strip. Please try again.'
        });
      }
      
      setErrors({ general: error.message || 'Failed to create strip. Please try again.' });
    }
    setLoading(false);
  };

  // Get today's date in YYYY-MM-DD format for date inputs
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Strip</h2>
                <p className="text-sm text-gray-600">For: {medicineName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            onFormSubmit={() => console.log('Form onFormSubmit triggered!')}
          >
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            {loading && processingStep && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="text-blue-700 font-medium">Processing Strip Creation</p>
                    <p className="text-blue-600 text-sm">{processingStep}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Hash className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
                <Input
                  label="Power *"
                  name="power"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.power || ''}
                  onChange={handleInputChange}
                  error={errors.power}
                  className="pl-10"
                  placeholder="e.g., 100.5"
                />
              </div>

              <div className="relative">
                <DollarSign className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
                <Input
                  label="Price *"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  error={errors.price}
                  className="pl-10"
                  placeholder="e.g., 25.99"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Batch Number *"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleInputChange}
                  error={errors.batchNumber}
                  placeholder="e.g., BATCH001"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Strip Code *"
                  name="stripCode"
                  value={formData.stripCode}
                  onChange={handleInputChange}
                  error={errors.stripCode}
                  placeholder="e.g., AB12"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
                <Input
                  label="Manufacturing Date *"
                  name="manufacturingDate"
                  type="date"
                  value={formData.manufacturingDate}
                  onChange={handleInputChange}
                  error={errors.manufacturingDate}
                  className="pl-10"
                  max={today}
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
                <Input
                  label="Expiry Date *"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  error={errors.expiryDate}
                  className="pl-10"
                  min={today}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="recalled">Recalled</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="relative">
                  <FileText className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange(e as any)}
                    placeholder="Enter strip description (optional)"
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    rows={3}
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  console.log('=== TEST BUTTON CLICKED ===');
                  console.log('Test button clicked!');
                  alert('Test button clicked! Check console.');
                  handleSubmit(new Event('submit') as any);
                }}
                className="flex-1"
              >
                Test Submit
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="flex-1"
                onClick={(e) => {
                  console.log('=== BUTTON CLICKED ===');
                  console.log('Button clicked!', e);
                  console.log('Button type:', e.currentTarget.type);
                  alert('Create Strip button clicked! Check console.');
                }}
              >
                {loading ? 'Creating on Blockchain...' : 'Create Strip'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
