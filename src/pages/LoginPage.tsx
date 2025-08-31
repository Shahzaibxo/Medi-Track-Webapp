import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Pill, Mail, Lock, Building, MapPin } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login, signup, isAuthenticated } = useAuth();
  const { addToast, ToastContainer } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/medicines" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isLogin && !formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!isLogin && !formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          addToast({
            type: 'success',
            title: 'Login Successful!',
            message: result.message
          });
          
          // Clear form data on successful login
          setFormData({
            companyName: "",
            email: "",
            password: "",
            location: "",
          });
          
          // Redirect will happen automatically due to isAuthenticated change
        } else {
          addToast({
            type: 'error',
            title: 'Login Failed',
            message: result.message
          });
        }
      } else {
        const result = await signup(
          formData.companyName,
          formData.email,
          formData.password,
          formData.location
        );
        
        if (result.success) {
          addToast({
            type: 'success',
            title: 'Account Created!',
            message: result.message
          });
          
          // Clear form data
          setFormData({
            companyName: "",
            email: "",
            password: "",
            location: "",
          });
          
          // Switch to login tab
          setIsLogin(true);
        } else {
          addToast({
            type: 'error',
            title: 'Signup Failed',
            message: result.message
          });
        }
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred'
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <ToastContainer />
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 text-white rounded-full mb-4">
            <Pill className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MediTrack</h1>
          <p className="text-gray-600 mt-2">
            Manufacturer Medicine Management System
          </p>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  isLogin
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  !isLogin
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <Building className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
                <Input
                  label="Company Name"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  error={errors.companyName}
                  className="pl-10"
                  placeholder="Enter your company name"
                />
              </div>
            )}

            {!isLogin && (
              <div className="relative">
                <MapPin className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
                <Input
                  label="Location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  error={errors.location}
                  className="pl-10"
                  placeholder="Enter your company location"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                className="pl-10"
                placeholder="Enter your email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                className="pl-10"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full cursor-pointer"
              size="lg"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-emerald-600 hover:text-emerald-500 cursor-pointer"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Connect to your manufacturer account to manage medicines</p>
        </div>
      </div>
    </div>
  );
};
