import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { CreateMedicineRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Pill, X, Upload, Eye, EyeOff } from 'lucide-react';

interface CreateMedicineFormProps {
  onClose: () => void;
  onSubmit: (medicineData: CreateMedicineRequest, imageFile: File) => void;
}

export const CreateMedicineForm: React.FC<CreateMedicineFormProps> = ({ onClose, onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    formula: '',
    company: user?.companyName || ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  // Update company when user changes
  useEffect(() => {
    if (user?.companyName) {
      setFormData(prev => ({ ...prev, company: user.companyName }));
    }
  }, [user?.companyName]);

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous URL if it exists
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      
      setImageFile(file);
      const newPreviewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(newPreviewUrl);
      
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Medicine name is required';
    }

    if (!formData.formula.trim()) {
      newErrors.formula = 'Formula is required';
    }

    // Company is automatically set from user context, no validation needed

    if (!imageFile) {
      newErrors.image = 'Medicine image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Call the onSubmit callback which will handle the API call and refresh
      await onSubmit(formData, imageFile!);
      
      // Show success toast
      addToast({
        type: 'success',
        title: 'Medicine Created!',
        message: 'Medicine has been successfully created and added to your inventory.'
      });
      
      onClose();
    } catch (error: any) {
      // Show error toast
      addToast({
        type: 'error',
        title: 'Creation Failed',
        message: error.message || 'Failed to create medicine. Please try again.'
      });
      
      setErrors({ general: error.message || 'Failed to create medicine. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Pill className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Medicine</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Medicine Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  placeholder="e.g., Aspirin 100mg"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Formula *"
                  name="formula"
                  value={formData.formula}
                  onChange={handleInputChange}
                  error={errors.formula}
                  placeholder="e.g., C9H8O4, Active ingredients"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Company *"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  error={errors.company}
                  placeholder="e.g., PharmaCorp Ltd."
                  readOnly
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Image *
                </label>
                                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      {imageFile ? (
                        <div className="space-y-2">
                          <img 
                            src={imagePreviewUrl || ''}
                            alt="Preview"
                            className="mx-auto h-32 w-auto object-cover rounded-lg border border-gray-200"
                          />
                          <p className="text-sm text-emerald-600 font-medium">
                            {imageFile.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              if (imagePreviewUrl) {
                                URL.revokeObjectURL(imagePreviewUrl);
                                setImagePreviewUrl(null);
                              }
                            }}
                            className="text-sm text-red-600 hover:text-red-500"
                          >
                            Remove image
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="image-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="image-upload"
                                name="image"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                {errors.image && (
                  <p className="text-sm text-red-600 mt-1">{errors.image}</p>
                )}
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
                type="submit"
                loading={loading}
                className="flex-1"
              >
                Create Medicine
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};