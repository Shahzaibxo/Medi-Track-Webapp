export interface Medicine {
  id: string;
  name: string;
  formula: string;
  company: string;
  createdAt: string;
  image?: string; // Base64 image data
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

// Backend API DTOs
export interface CreateMedicineRequest {
  name: string;
  formula: string;
  company: string;
}

export interface UpdateMedicineRequest {
  name?: string;
  formula?: string;
}

export interface MedicineListingRequest {
  name?: string;
  formula?: string;
  company?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: string;
}

export interface SignupRequest {
  companyName: string;
  email: string;
  password: string;
  location: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  companyName: string;
  email: string;
  location: string;
}

export interface UserDTO {
  id: string;
  email: string;
  companyName: string;
  location: string;
}

export interface MessageResponse {
  message: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}