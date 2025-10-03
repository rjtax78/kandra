import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

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

export default function ClerkLogin() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Custom Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
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
          </div>

          {/* Clerk SignIn Component */}
          <div className="flex justify-center">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-xl border-0 bg-white rounded-lg",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50",
                  formButtonPrimary: "w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold",
                  formFieldInput: "h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                  footerActionLink: "text-blue-600 hover:text-blue-500",
                  dividerLine: "bg-gray-300",
                  dividerText: "text-gray-500",
                  formFieldLabel: "text-sm font-medium text-gray-700",
                  identityPreviewText: "text-gray-600",
                  formResendCodeLink: "text-blue-600 hover:text-blue-500"
                },
                layout: {
                  socialButtonsPlacement: "bottom"
                }
              }}
              redirectUrl="/"
              signUpUrl="/register"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="flex-1 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent" />
        <CryptoIllustration />
      </div>
    </div>
  );
}