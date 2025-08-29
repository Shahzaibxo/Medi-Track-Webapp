import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { Strip } from "../../types";
import { X, Package } from "lucide-react";

interface AddStripFormProps {
  medicineId: string;
  medicineName: string;
  onClose: () => void;
  onSubmit: (strip: Omit<Strip, "id">) => void;
}

export const AddStripForm: React.FC<AddStripFormProps> = ({
  medicineId,
  medicineName,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    batchNumber: "",
    expiryDate: "",
    manufacturingDate: "",
    quantity: "",
    price: "",
    location: "",
    status: "available" as Strip["status"],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const locations = [
    "Warehouse A - Shelf 1",
    "Warehouse A - Shelf 2",
    "Warehouse A - Shelf 3",
    "Warehouse B - Shelf 1",
    "Warehouse B - Shelf 2",
    "Warehouse C - Shelf 1",
    "Cold Storage - Section A",
    "Cold Storage - Section B",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = "Batch number is required";
    }

    if (!formData.manufacturingDate) {
      newErrors.manufacturingDate = "Manufacturing date is required";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (
      formData.manufacturingDate &&
      new Date(formData.expiryDate) <= new Date(formData.manufacturingDate)
    ) {
      newErrors.expiryDate = "Expiry date must be after manufacturing date";
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const stripData: Omit<Strip, "id"> = {
        medicineId,
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate,
        manufacturingDate: formData.manufacturingDate,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        location: formData.location,
        status: formData.status,
      };

      onSubmit(stripData);
      onClose();
    } catch (error) {
      setErrors({ general: "Failed to add strip. Please try again." });
    }
    setLoading(false);
  };

  // Generate suggested batch number
  const generateBatchNumber = () => {
    const prefix = medicineName.substring(0, 3).toUpperCase();
    const date = new Date().toISOString().slice(0, 7).replace("-", "");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}-${date}-${random}`;
  };

  const handleGenerateBatch = () => {
    const batchNumber = generateBatchNumber();
    setFormData((prev) => ({ ...prev, batchNumber }));
    if (errors.batchNumber) {
      setErrors((prev) => ({ ...prev, batchNumber: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Strip
                </h2>
                <p className="text-gray-600">{medicineName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      label="Batch Number *"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleInputChange}
                      error={errors.batchNumber}
                      placeholder="e.g., ASP-202401-001"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGenerateBatch}
                      className="mb-1"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              <Input
                label="Manufacturing Date *"
                name="manufacturingDate"
                type="date"
                value={formData.manufacturingDate}
                onChange={handleInputChange}
                error={errors.manufacturingDate}
              />

              <Input
                label="Expiry Date *"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleInputChange}
                error={errors.expiryDate}
              />

              <Input
                label="Quantity *"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
                error={errors.quantity}
                placeholder="Number of units"
              />

              <Input
                label="Price per Unit *"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={handleInputChange}
                error={errors.price}
                placeholder="0.00"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Location *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`
                    w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${
                      errors.location
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : ""
                    }
                  `}
                >
                  <option value="">Select location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {errors.location && (
                  <p className="text-sm text-red-600 mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>Medicine: {medicineName}</p>
                {formData.quantity && formData.price && (
                  <p>
                    Total Value: $
                    {(
                      parseInt(formData.quantity || "0") *
                      parseFloat(formData.price || "0")
                    ).toFixed(2)}
                  </p>
                )}
                {formData.expiryDate && (
                  <p>
                    Days until expiry:{" "}
                    {Math.ceil(
                      (new Date(formData.expiryDate).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="flex-1 cursor-pointer"
              >
                Add Strip
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
