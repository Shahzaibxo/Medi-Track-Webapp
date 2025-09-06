import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { 
  SignupRequest, 
  SigninRequest, 
  TokenResponse, 
  MessageResponse,
  CreateMedicineRequest,
  UpdateMedicineRequest,
  MedicineListingRequest,
  CreateStripRequest,
  CreateStripResponse
} from '../types';

// API Configuration
export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

// Request Configuration
export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  params?: Record<string, any>;
  query?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  timeout?: number;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  status: number;
}

// Error response
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  constructor(config: ApiConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.defaultHeaders,
      },
    });

    this.setupInterceptors();
    this.loadAuthToken();
  }

  // Setup axios interceptors
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available and required
        if (this.authToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        console.error('Response Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        });

        // Transform axios error to our ApiError format
        const responseData = error.response?.data as any;
        const apiError: ApiError = {
          message: responseData?.message || error.message || 'Network error occurred',
          status: error.response?.status || 0,
          errors: responseData?.errors,
        };

        return Promise.reject(apiError);
      }
    );
  }

  // Load auth token from localStorage
  private loadAuthToken(): void {
    this.authToken = localStorage.getItem('authToken');
  }

  // Set auth token
  public setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  // Remove auth token
  public removeAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem('authToken');
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.authToken;
  }

  // Main request method
  public async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      this.loadAuthToken(); // Refresh token from storage
      
      const { method, endpoint, params, query, body, headers: customHeaders, requiresAuth = false, timeout } = config;
      
      // Build axios config
      const axiosConfig: AxiosRequestConfig = {
        method: method.toLowerCase() as any,
        url: endpoint,
        headers: customHeaders,
        data: body,
      };

      // Add timeout if specified
      if (timeout !== undefined) {
        axiosConfig.timeout = timeout;
      }

      // Add query parameters
      if (query) {
        axiosConfig.params = query;
      }

      // Add path parameters
      if (params) {
        let processedUrl = endpoint;
        Object.entries(params).forEach(([key, value]) => {
          processedUrl = processedUrl.replace(`:${key}`, encodeURIComponent(value));
        });
        axiosConfig.url = processedUrl;
      }

      // Add auth header if required
      if (requiresAuth && this.authToken) {
        axiosConfig.headers = {
          ...axiosConfig.headers,
          Authorization: `Bearer ${this.authToken}`,
        };
      }

      // Make request
      const response = await this.axiosInstance.request<T>(axiosConfig);

      return {
        data: response.data,
        success: true,
        message: (response.data as any)?.message,
        status: response.status,
      };

    } catch (error: any) {
      // Error is already transformed by the response interceptor
      throw error;
    }
  }

  // Convenience methods for common HTTP methods
  public async get<T = any>(endpoint: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      endpoint,
      ...config,
    });
  }

  public async post<T = any>(endpoint: string, body?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      endpoint,
      body,
      ...config,
    });
  }

  public async put<T = any>(endpoint: string, body?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      endpoint,
      body,
      ...config,
    });
  }

  public async delete<T = any>(endpoint: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      endpoint,
      ...config,
    });
  }

  public async patch<T = any>(endpoint: string, body?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      endpoint,
      body,
      ...config,
    });
  }
}

// Create default API client instance
export const apiClient = new ApiClient({
  baseURL: 'http://192.168.0.46:8081/api',
  timeout: 30000, // 30 seconds for blockchain operations
});

// Authentication specific methods
export class AuthService {
  constructor(private client: ApiClient) {}

  async signup(data: SignupRequest): Promise<ApiResponse<MessageResponse>> {
    return this.client.post<MessageResponse>('/manufacturer/signup', data);
  }

  async signin(data: SigninRequest): Promise<ApiResponse<TokenResponse>> {
    return this.client.post<TokenResponse>('/manufacturer/signin', data);
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.client.get('/manufacturer/me', { requiresAuth: true });
  }

  async logout(): Promise<void> {
    this.client.removeAuthToken();
  }
}

// Medicine specific methods
export class MedicineService {
  constructor(private client: ApiClient) {}

  async createMedicine(medicineData: CreateMedicineRequest, imageFile: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('name', medicineData.name);
    formData.append('formula', medicineData.formula);
    formData.append('company', medicineData.company);
    formData.append('image', imageFile);

    return this.client.post('/medicines', formData, { 
      requiresAuth: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  }

  async updateMedicine(medicineId: string, medicineData: UpdateMedicineRequest): Promise<ApiResponse<any>> {
    return this.client.put(`/medicines/${medicineId}`, medicineData, { requiresAuth: true });
  }

  async deleteMedicine(medicineId: string): Promise<ApiResponse<any>> {
    return this.client.delete(`/medicines/${medicineId}`, { requiresAuth: true });
  }

  async getMedicines(filters: MedicineListingRequest = {}): Promise<ApiResponse<any>> {
    return this.client.get('/medicines', { 
      query: filters, 
      requiresAuth: true 
    });
  }
}

// Strip specific methods
export class StripService {
  private stripClient: ApiClient;

  constructor(private client: ApiClient) {
    // Create a specialized client for strip operations with longer timeout
    this.stripClient = new ApiClient({
      baseURL: 'http://192.168.0.46:8081/api',
      timeout: 60000, // 60 seconds for blockchain strip operations
    });
  }

  async createStrip(stripData: CreateStripRequest): Promise<ApiResponse<CreateStripResponse>> {
    // Use the specialized client for strip creation
    console.log('StripService.createStrip called with data:', stripData);
    console.log('Making POST request to /strips');
    return this.stripClient.post<CreateStripResponse>('/strips', stripData, { requiresAuth: true });
  }

  async getStripsByMedicine(medicineId: string): Promise<ApiResponse<any>> {
    // Use the correct endpoint as specified by user
    console.log('Fetching strips for medicine:', medicineId);
    console.log('API URL will be:', `/strips/medicine/${medicineId}`);
    return this.client.get(`/strips/medicine/${medicineId}`, { requiresAuth: true });
  }

  async getStripById(stripId: string): Promise<ApiResponse<any>> {
    return this.client.get(`/strips/${stripId}`, { requiresAuth: true });
  }

  async getStripByCode(code: string): Promise<ApiResponse<any>> {
    console.log('Fetching strip by code:', code);
    console.log('API URL will be:', `/strips/code/${code}`);
    return this.client.get(`/strips/code/${code}`, { requiresAuth: true });
  }

  async callStripApi(stripCode: string): Promise<ApiResponse<any>> {
    // POST API call with strip code as path parameter
    return this.client.get(`/strips/code/${stripCode}`,  { requiresAuth: true });
  }

  async updateStrip(stripId: string, stripData: Partial<CreateStripRequest>): Promise<ApiResponse<any>> {
    return this.client.put(`/strips/${stripId}`, stripData, { requiresAuth: true });
  }

  async deleteStrip(stripId: string): Promise<ApiResponse<any>> {
    return this.client.delete(`/strips/${stripId}`, { requiresAuth: true });
  }

  async uploadStripsFile(file: File, medicineId: string): Promise<ApiResponse<any>> {
    console.log('Uploading strips file:', file.name, 'for medicine:', medicineId);
    console.log('API URL will be:', '/strips/upload-csv');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('medicineId', medicineId);
    
    try {
      const response = await this.client.request({
        method: 'POST',
        endpoint: '/strips/upload-csv',
        body: formData,
        requiresAuth: true,
        timeout: 0, // Disable timeout for file uploads
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('=== RAW API RESPONSE FROM SERVER ===');
      console.log('Raw response:', response);
      console.log('Response data structure:', JSON.stringify(response, null, 2));
      console.log('=== END RAW API RESPONSE ===');
      
      return response;
    } catch (error) {
      console.error('=== API ERROR ===');
      console.error('Error details:', error);
      console.error('=== END API ERROR ===');
      throw error;
    }
  }
}

// Export service instances
export const authService = new AuthService(apiClient);
export const medicineService = new MedicineService(apiClient);
export const stripService = new StripService(apiClient);