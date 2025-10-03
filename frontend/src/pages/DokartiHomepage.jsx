import React, { useState, useEffect, useRef } from 'react';
import { Search, Bookmark, Bell, MessageSquare, Grid3X3, User, History, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, USER_ROLES } from '../utils/roleUtils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const DokartiHomepage = () => {
  const [salaryRange, setSalaryRange] = useState([10, 60]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const userRole = getUserRole(user);

  // Handle sign out
  const handleSignOut = async () => {
    const confirmSignOut = window.confirm('Are you sure you want to sign out?');
    if (!confirmSignOut) return;
    
    try {
      await signOut();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Company logos component
  const CompanyLogo = ({ company }) => {
    switch (company.toLowerCase()) {
      case 'facebook':
        return (
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">f</span>
          </div>
        );
      case 'google':
        return (
          <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">G</span>
          </div>
        );
      case 'paypal':
        return (
          <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
        );
      case 'linkedin':
        return (
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">in</span>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">{company.charAt(0)}</span>
          </div>
        );
    }
  };

  // Job cards data matching the image
  const jobCards = [
    {
      id: 1,
      title: "Product Designer",
      company: "Facebook, Inc.",
      verified: true,
      level: "Expert",
      budget: "$ 8000",
      description: "Facebook is opening opportunities to join our team! We are looking for talented and passionate...",
      skills: ["Figma", "Illustration", "After Effect", "Blender"],
      rating: 5,
      posted: "Posted 47 min ago"
    },
    {
      id: 2,
      title: "UI/UX Designer", 
      company: "Google, Inc.",
      verified: true,
      level: "Expert",
      budget: "$ 6000",
      description: "Google opens opportunities for talented UI/UX Designers to join our creative team...",
      skills: ["Full-time", "UI/UX Designer", "Website Design"],
      rating: 5,
      posted: "Posted 47 min ago"
    },
    {
      id: 3,
      title: "UX Designer",
      company: "PayPal, Inc.", 
      verified: true,
      level: "Intermediate",
      budget: "$ 3000",
      description: "PayPal is opening up opportunities for talented, passionate UX Designers to join our team...",
      skills: ["Figma", "Illustration", "Website Design"],
      rating: 4,
      posted: "Posted 47 min ago"
    },
    {
      id: 4,
      title: "Graphic Designer",
      company: "LinkedIn, Inc.",
      verified: true, 
      level: "Intermediate",
      budget: "$ 5000",
      description: "LinkedIn is looking for a talented Graphic Designer to join our creative team...",
      skills: ["Adobe Suite", "Branding", "Print Design"],
      rating: 5,
      posted: "Posted 47 min ago"
    }
  ];

  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Filter Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Filter</h2>
            
            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">Category</label>
              <Select defaultValue="anytime">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anytime">Anytime</SelectItem>
                  <SelectItem value="design">Design & Creative</SelectItem>
                  <SelectItem value="development">Development & IT</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">Job Type</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="fulltime" defaultChecked />
                  <label htmlFor="fulltime" className="text-sm text-gray-700">Full-time</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="internship" />
                  <label htmlFor="internship" className="text-sm text-gray-700">Internship</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="freelance" />
                  <label htmlFor="freelance" className="text-sm text-gray-700">Freelance</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="volunteer" />
                  <label htmlFor="volunteer" className="text-sm text-gray-700">Volunteer</label>
                </div>
              </div>
            </div>

            {/* Experience Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">Experience level</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="entry" defaultChecked />
                  <label htmlFor="entry" className="text-sm text-gray-700">Entry level</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="intermediate" />
                  <label htmlFor="intermediate" className="text-sm text-gray-700">Intermediate</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="expert" />
                  <label htmlFor="expert" className="text-sm text-gray-700">Expert</label>
                </div>
              </div>
            </div>

            {/* Expected Salary */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">Expected salary</label>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>${salaryRange[0]}</span>
                  <span>${salaryRange[1]}</span>
                </div>
                <Slider
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                  max={100}
                  min={10}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="under100" defaultChecked />
                  <label htmlFor="under100" className="text-sm text-gray-700">Under $100</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="100to1k" />
                  <label htmlFor="100to1k" className="text-sm text-gray-700">$100 to $1K</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="hourly" />
                  <label htmlFor="hourly" className="text-sm text-gray-700">Hourly</label>
                </div>
              </div>
            </div>

            {/* Number of proposals */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">Number of proposals</label>
              <div className="space-y-3">
                {['Less than 5', '5 to 10', '10 to 15', '15 to 20', 'More than 20'].map((range, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`proposals-${index}`}
                      name="proposals"
                      className="w-4 h-4 text-blue-600"
                    />
                    <label htmlFor={`proposals-${index}`} className="text-sm text-gray-700">{range}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {/* Header Section with Search */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
            {/* Decorative Stars */}
            <div className="absolute inset-0">
              <div className="absolute top-8 left-1/4 text-white/30 text-2xl">✦</div>
              <div className="absolute top-16 right-1/4 text-white/30 text-lg">+</div>
              <div className="absolute top-12 right-1/3 text-white/30 text-xl">✦</div>
              <div className="absolute bottom-8 left-1/3 text-white/30 text-lg">+</div>
              <div className="absolute bottom-12 right-1/5 text-white/30 text-2xl">✦</div>
            </div>
            
            <div className="relative px-8 py-12 text-white">
              <h1 className="text-3xl font-bold mb-4">
                Find your dream job here
              </h1>
              <p className="text-lg text-white/90 mb-8 max-w-2xl">
                Join Dokarti. Dokarti is a place where you find your dream job in various skills here, 
                you will also get many other benefits
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search your job"
                    className="w-full pl-12 pr-32 py-3 border-0 rounded-xl text-gray-900 placeholder-gray-500 bg-white"
                  />
                  <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                    Search
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <History className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Job Cards Area */}
          <div className="flex-1 p-8 bg-white">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {jobCards.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <CompanyLogo company={job.company} />
                        <div>
                          <h3 className="font-semibold text-base text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{job.company}</span>
                            {job.verified && (
                              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                        <Bookmark className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Level and Budget Tags */}
                    <div className="flex gap-2 mb-4">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        {job.level}
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                        Est. Budget: {job.budget}
                      </Badge>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 3 && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50">
                          +{job.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <StarRating rating={job.rating} />
                      <span className="text-xs text-gray-500">{job.posted}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DokartiHomepage;