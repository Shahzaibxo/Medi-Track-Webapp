export interface Medicine {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  category: string;
  dosageForm: string;
  strength: string;
  createdAt: string;
  stripCount: number;
}

export interface Strip {
  id: string;
  medicineId: string;
  batchNumber: string;
  expiryDate: string;
  manufacturingDate: string;
  quantity: number;
  price: number;
  location: string;
  status: 'available' | 'low-stock' | 'out-of-stock';
}

export interface StripDetail extends Strip {
  barcode: string;
  supplier: string;
  notes: string;
  lastUpdated: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}