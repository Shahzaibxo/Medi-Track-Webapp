import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserDTO, TokenResponse } from "../types";
import { ApiService, setAuthToken, removeAuthToken, isAuthenticated } from "../services/api";

interface AuthContextType {
  user: UserDTO | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (companyName: string, email: string, password: string, location: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response: TokenResponse = await ApiService.manufacturerSignin({ email, password });
      
      setAuthToken(response.accessToken);
      
        const userData: UserDTO = {
          id: Date.now().toString(),
          email: response.email,
          companyName: response.companyName,
          location: response.location
        };
      
      setUser(userData);
      
      localStorage.setItem("user", JSON.stringify(userData));
      
      return { 
        success: true, 
        message: `Welcome back, ${response.companyName}!` 
      };
    } catch (error: any) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.message || 'Invalid email or password' 
      };
    }
  };

  const signup = async (
    companyName: string,
    email: string,
    password: string,
    location: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await ApiService.manufacturerSignup({ 
        companyName, 
        email, 
        password, 
        location 
      });
      
      // Return success with message for toast notification
      return { 
        success: true, 
        message: response.message || 'Account created successfully! Please sign in.' 
      };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { 
        success: false, 
        message: error.message || 'Failed to create account' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    removeAuthToken();
    localStorage.removeItem("user");
  };

  const checkAuth = async () => {
    try {
      if (isAuthenticated()) {
        const userData = await ApiService.getCurrentUser();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Auth check error:", error);
      logout();
    }
  };

  // Check for existing user on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && isAuthenticated()) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify token is still valid
        checkAuth();
      } catch (error) {
        console.error("Error parsing saved user:", error);
        logout();
      }
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
