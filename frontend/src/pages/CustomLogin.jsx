import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';

const CryptoIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Main 3D Platform */}
    <div className="relative">
      {/* Base Platform */}
      <div className="w-48 h-20 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl shadow-2xl transform perspective-1000 rotateX-[15deg]" />
      
      {/* Cylinder Container */}
      <div className="absolute top-[-60px] left-1/2 transform -translate-x-1/2">
        <div className="w-24 h-32 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg relative">
          {/* Top Circle */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full" />
          
          {/* Crypto Symbol */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-sm" />
            </div>
          </div>
          
          {/* Data Visualization */}
          <div className="absolute bottom-4 left-2 right-2">
            <div className="w-full h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded opacity-80" />
          </div>
        </div>
      </div>
      
      {/* Robotic Arms */}
      <div className="absolute top-[-20px] left-[-30px]">
        <div className="w-16 h-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transform rotate-[-25deg]" />
        <div className="absolute right-0 top-[-2px] w-8 h-7 bg-gradient-to-b from-gray-500 to-gray-700 rounded" />
      </div>
      
      <div className="absolute top-[-20px] right-[-30px]">
        <div className="w-16 h-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transform rotate-[25deg]" />
        <div className="absolute left-0 top-[-2px] w-8 h-7 bg-gradient-to-b from-gray-500 to-gray-700 rounded" />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute -top-16 -left-12 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl opacity-20 animate-pulse" />
      <div className="absolute -top-12 -right-16 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl opacity-20 animate-pulse delay-1000" />
      <div className="absolute -bottom-8 -left-20 w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-xl opacity-20 animate-pulse delay-2000" />
    </div>
  </div>
);

export default function CustomLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, isLoading, getRoleBasedPath } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      console.log('Attempting login with:', { email: formData.email });
      
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        console.log('Login successful:', result.user);
        
        // Success message
        const userName = result.user?.prenom || 'User';
        alert(`Welcome back, ${userName}! Login successful.`);
        
        // Role-based redirect
        const redirectPath = getRoleBasedPath(result.user?.role);
        console.log(`Redirecting user with role '${result.user?.role}' to: ${redirectPath}`);
        navigate(redirectPath);
      } else {
        // Handle login error
        console.error('Login failed:', result.error);
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Illustration */}
      <div className="flex-1 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent" />
        <CryptoIllustration />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-white shadow-xl border-0">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Kandra</span>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="border-b-2 border-blue-500 pb-2 pr-4">
                <span className="text-blue-600 font-semibold">Login</span>
              </div>
              <Link to="/register" className="pb-2 pl-4 text-gray-500 hover:text-gray-700">
                Sign Up
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-9 h-11 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-9 pr-9 h-11 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Error Message */}
              {errors.submit && (
                <div className="text-center">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
            </form>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  Create one here
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Student:</strong> student1759477462282@test.com</p>
                <p><strong>Company:</strong> company1759477498591@test.com</p>
                <p><strong>Password:</strong> TestPassword123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}