import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Pill, Building, MapPin, Mail, Lock, ArrowLeft } from "lucide-react";

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { signup, isAuthenticated } = useAuth();
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

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = "Company name must be at least 2 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (formData.location.trim().length < 2) {
      newErrors.location = "Location must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await signup(
        formData.companyName,
        formData.email,
        formData.password,
        formData.location
      );
      
      if (result.success) {
        addToast({
          type: 'success',
          title: 'Account Created Successfully!',
          message: result.message
        });
        
        // Clear form data
        setFormData({
          companyName: "",
          email: "",
          password: "",
          confirmPassword: "",
          location: "",
        });
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        addToast({
          type: 'error',
          title: 'Signup Failed',
          message: result.message
        });
      }
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'An unexpected error occurred'
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
            Create your manufacturer account
          </p>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Sign Up</h2>
              <Link
                to="/login"
                className="flex items-center text-sm text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
            <p className="text-gray-600 text-sm">
              Join MediTrack to manage your medicine manufacturing and distribution
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                required
              />
            </div>

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
                required
              />
            </div>

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
                placeholder="Enter your email address"
                required
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
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                className="pl-10"
                placeholder="Confirm your password"
                required
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full cursor-pointer"
              size="lg"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Sign in here
            </Link>
          </div>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};
