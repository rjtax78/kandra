import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

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

export default function Register() {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      alert('Please accept the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Illustration */}
      <div className="flex-1 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent" />
        <CryptoIllustration />
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-white shadow-xl border-0">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Cryptonext</span>
            </div>

            {/* Tab Navigation */}
            <div className="flex mb-8">
              <Link to="/login" className="pb-2 pr-4 text-gray-500 hover:text-gray-700">
                Login
              </Link>
              <div className="border-b-2 border-blue-500 pb-2 pl-4">
                <span className="text-blue-600 font-semibold">Sign Up</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name..."
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address..."
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password..."
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms}
                    onCheckedChange={setAgreeToTerms}
                    className="mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    Please keep me updated by email with latest crypto news, research findings, reward programs, event updates and more information from Cryptonext.
                  </Label>
                </div>
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  'Create an Account'
                )}
              </Button>

              {/* Separator */}
              <div className="relative">
                <Separator />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                  OR
                </span>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded mr-2" />
                  Continue with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <div className="w-5 h-5 bg-gray-800 rounded mr-2" />
                  Continue with Apple
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded mr-2" />
                  Continue with Wallet
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
