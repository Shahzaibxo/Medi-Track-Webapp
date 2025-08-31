import { 
  CreateMedicineRequest, 
  UpdateMedicineRequest, 
  MedicineListingRequest,
  SignupRequest,
  SigninRequest,
  TokenResponse,
  MessageResponse,
  ApiResponse
} from '../types';

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

// API service class
export class ApiService {
  // Manufacturer Authentication
  static async manufacturerSignup(signupData: SignupRequest): Promise<MessageResponse> {
    const response = await fetch(`${API_BASE_URL}/manufacturer/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });
    return handleResponse<MessageResponse>(response);
  }

  static async manufacturerSignin(signinData: SigninRequest): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/manufacturer/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signinData),
    });
    return handleResponse<TokenResponse>(response);
  }

  static async getCurrentUser(): Promise<any> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/manufacturer/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  }

  // Medicine Management
  static async createMedicine(medicineData: CreateMedicineRequest, imageFile: File): Promise<any> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('name', medicineData.name);
    formData.append('formula', medicineData.formula);
    formData.append('company', medicineData.company);
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/medicines`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  }

  static async updateMedicine(medicineId: string, medicineData: UpdateMedicineRequest): Promise<any> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/medicines/${medicineId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicineData),
    });
    return handleResponse(response);
  }

  static async deleteMedicine(medicineId: string): Promise<any> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/medicines/${medicineId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  }

  static async getMedicines(filters: MedicineListingRequest = {}): Promise<any> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/medicines${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  }


}

// Utility functions
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
