# API Client Documentation

This document explains how to use the new reusable API client system in the MediTrack application.

## Overview

The new API client system provides a flexible, reusable way to make HTTP requests with support for:
- Dynamic endpoints with path parameters
- Query parameters
- Request bodies (JSON and FormData)
- Authentication headers
- Error handling
- Request timeouts
- Response parsing

## Core Components

### 1. ApiClient Class

The main API client class that handles all HTTP requests.

```typescript
import { apiClient } from './ApiClient';

// Basic usage
const response = await apiClient.get('/users');
const response = await apiClient.post('/users', { name: 'John' });
const response = await apiClient.put('/users/123', { name: 'Jane' });
const response = await apiClient.delete('/users/123');
```

### 2. Request Configuration

The `RequestConfig` interface allows you to configure requests with:

```typescript
interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  params?: Record<string, any>;        // Path parameters
  query?: Record<string, any>;         // Query parameters
  body?: any;                          // Request body
  headers?: Record<string, string>;    // Custom headers
  requiresAuth?: boolean;              // Whether to include auth token
}
```

### 3. Advanced Usage Examples

#### Path Parameters
```typescript
// Endpoint: /users/:id/posts/:postId
const response = await apiClient.get('/users/:id/posts/:postId', {
  params: { id: '123', postId: '456' }
});
// Results in: /users/123/posts/456
```

#### Query Parameters
```typescript
const response = await apiClient.get('/users', {
  query: { 
    page: 1, 
    limit: 10, 
    search: 'john' 
  }
});
// Results in: /users?page=1&limit=10&search=john
```

#### Authentication
```typescript
const response = await apiClient.get('/protected-endpoint', {
  requiresAuth: true
});
// Automatically includes Authorization header
```

#### Custom Headers
```typescript
const response = await apiClient.post('/upload', formData, {
  headers: {
    'Custom-Header': 'value'
  }
});
```

#### FormData Support
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('name', 'test');

const response = await apiClient.post('/upload', formData);
// Automatically handles FormData and sets appropriate headers
```

### 4. Service Classes

#### AuthService
Pre-configured service for authentication endpoints:

```typescript
import { authService } from './ApiClient';

// Sign up
const response = await authService.signup({
  companyName: 'Test Company',
  email: 'test@example.com',
  password: 'password123',
  location: 'New York'
});

// Sign in
const response = await authService.signin({
  email: 'test@example.com',
  password: 'password123'
});

// Get current user
const response = await authService.getCurrentUser();
```

#### MedicineService
Pre-configured service for medicine management:

```typescript
import { medicineService } from './ApiClient';

// Create medicine
const response = await medicineService.createMedicine(medicineData, imageFile);

// Update medicine
const response = await medicineService.updateMedicine(medicineId, updateData);

// Delete medicine
const response = await medicineService.deleteMedicine(medicineId);

// Get medicines with filters
const response = await medicineService.getMedicines({
  name: 'Aspirin',
  page: 1,
  limit: 10
});
```

## Response Format

All API responses follow this format:

```typescript
interface ApiResponse<T> {
  data: T;                    // The actual response data
  success: boolean;           // Whether the request was successful
  message?: string;           // Optional message from the server
  status: number;             // HTTP status code
}
```

## Error Handling

The API client provides comprehensive error handling:

```typescript
try {
  const response = await apiClient.get('/users');
  console.log(response.data);
} catch (error) {
  if (error.status) {
    // API error (4xx, 5xx)
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Errors:', error.errors);
  } else {
    // Network error or timeout
    console.error('Network Error:', error.message);
  }
}
```

## Configuration

### Creating a Custom API Client

```typescript
import { ApiClient } from './ApiClient';

const customClient = new ApiClient({
  baseURL: 'https://api.example.com',
  timeout: 15000,
  defaultHeaders: {
    'X-Custom-Header': 'value'
  }
});
```

### Authentication Management

```typescript
import { apiClient } from './ApiClient';

// Set auth token
apiClient.setAuthToken('your-jwt-token');

// Check if authenticated
const isAuth = apiClient.isAuthenticated();

// Remove auth token
apiClient.removeAuthToken();
```

## Migration from Legacy API

The legacy `ApiService` class has been updated to use the new API client internally, so existing code will continue to work without changes. However, it's recommended to migrate to the new API client for new features.

### Before (Legacy)
```typescript
import { ApiService } from './api';

const response = await ApiService.manufacturerSignin({ email, password });
```

### After (New API Client)
```typescript
import { authService } from './ApiClient';

const response = await authService.signin({ email, password });
```

## Best Practices

1. **Use Service Classes**: Prefer using `AuthService` and `MedicineService` for domain-specific operations.

2. **Handle Errors**: Always wrap API calls in try-catch blocks and handle both API and network errors.

3. **Type Safety**: Use TypeScript interfaces for request and response types.

4. **Authentication**: Use the `requiresAuth: true` option for protected endpoints.

5. **FormData**: Let the client handle FormData automatically - don't set Content-Type headers manually.

6. **Timeouts**: Configure appropriate timeouts for your use case (default is 10 seconds).

## Examples

### Complete Authentication Flow

```typescript
import { authService, apiClient } from './ApiClient';

// Sign up
try {
  const signupResponse = await authService.signup({
    companyName: 'My Company',
    email: 'user@example.com',
    password: 'securePassword123',
    location: 'San Francisco'
  });
  
  console.log('Signup successful:', signupResponse.data.message);
} catch (error) {
  console.error('Signup failed:', error.message);
}

// Sign in
try {
  const signinResponse = await authService.signin({
    email: 'user@example.com',
    password: 'securePassword123'
  });
  
  // Set auth token
  apiClient.setAuthToken(signinResponse.data.accessToken);
  
  console.log('Login successful:', signinResponse.data.companyName);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Medicine Management

```typescript
import { medicineService } from './ApiClient';

// Get medicines with pagination and filtering
try {
  const response = await medicineService.getMedicines({
    name: 'Aspirin',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    direction: 'desc'
  });
  
  console.log('Medicines:', response.data);
} catch (error) {
  console.error('Failed to fetch medicines:', error.message);
}
```

This API client system provides a robust, flexible foundation for all HTTP communication in the MediTrack application while maintaining backward compatibility with existing code.
