import { 
  CreateMedicineRequest, 
  UpdateMedicineRequest, 
  MedicineListingRequest,
  SignupRequest,
  SigninRequest,
  TokenResponse,
  MessageResponse,
  ApiResponse,
  CreateStripRequest,
  CreateStripResponse
} from '../types';
import { apiClient, authService, medicineService, stripService } from './ApiClient';

const API_BASE_URL = 'http://localhost:8081/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Legacy API service class - now using the new ApiClient
export class ApiService {
  // Manufacturer Authentication - now using new ApiClient
  static async manufacturerSignup(signupData: SignupRequest): Promise<MessageResponse> {
    const response = await authService.signup(signupData);
    return response.data;
  }

  static async manufacturerSignin(signinData: SigninRequest): Promise<TokenResponse> {
    const response = await authService.signin(signinData);
    return response.data;
  }

  static async getCurrentUser(): Promise<any> {
    const response = await authService.getCurrentUser();
    return response.data;
  }

  // Medicine Management - now using new ApiClient
  static async createMedicine(medicineData: CreateMedicineRequest, imageFile: File): Promise<any> {
    const response = await medicineService.createMedicine(medicineData, imageFile);
    return response.data;
  }

  static async updateMedicine(medicineId: string, medicineData: UpdateMedicineRequest): Promise<any> {
    const response = await medicineService.updateMedicine(medicineId, medicineData);
    return response.data;
  }

  static async deleteMedicine(medicineId: string): Promise<any> {
    const response = await medicineService.deleteMedicine(medicineId);
    return response.data;
  }

  static async getMedicines(filters: MedicineListingRequest = {}): Promise<any> {
    const response = await medicineService.getMedicines(filters);
    return response.data;
  }

  // Strip Management - now using new ApiClient
  static async createStrip(stripData: CreateStripRequest): Promise<CreateStripResponse> {
    const response = await stripService.createStrip(stripData);
    return response.data;
  }

  static async getStripsByMedicine(medicineId: string): Promise<any> {
    const response = await stripService.getStripsByMedicine(medicineId);
    return response.data;
  }

  static async getStripById(stripId: string): Promise<any> {
    const response = await stripService.getStripById(stripId);
    return response.data;
  }

  static async updateStrip(stripId: string, stripData: Partial<CreateStripRequest>): Promise<any> {
    const response = await stripService.updateStrip(stripId, stripData);
    return response.data;
  }

  static async deleteStrip(stripId: string): Promise<any> {
    const response = await stripService.deleteStrip(stripId);
    return response.data;
  }
}

// Utility functions - now using new ApiClient
export const setAuthToken = (token: string): void => {
  apiClient.setAuthToken(token);
};

export const removeAuthToken = (): void => {
  apiClient.removeAuthToken();
};

export const isAuthenticated = (): boolean => {
  return apiClient.isAuthenticated();
};
