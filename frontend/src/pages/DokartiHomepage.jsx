import React, { useState, useEffect, useRef } from 'react';
import { Search, Bookmark, Bell, MessageSquare, Grid3X3, User, History, ChevronDown, LogOut, Settings, Loader2, AlertCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import {
  fetchJobs,
  searchJobs,
  bookmarkJob,
  setSearchQuery,
  setFilters,
  toggleFilter,
  setSalaryRange,
  resetJobs,
  clearError as clearJobsError
} from '../store/slices/jobsSlice';
import { submitJobApplication, clearError as clearApplicationError, clearSuccessMessage } from '../store/slices/applicationSlice';
import JobApplicationModal from '../components/student/JobApplicationModal';

const DokartiHomepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const menuRef = useRef(null);
  
  // Redux state
  const {
    jobs,
    isLoading,
    isLoadingMore,
    isSearching,
    error,
    searchQuery,
    filters,
    bookmarkedJobs,
    hasMore
  } = useSelector((state) => state.studentJobs);
  
  // Application state
  const {
    isSubmitting,
    error: applicationError,
    successMessage
  } = useSelector((state) => state.studentApplications);
  
  // Local state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Helper function to build filter parameters for API
  const buildFilterParams = (currentFilters) => {
    const params = {};
    
    // Job types
    const activeJobTypes = Object.entries(currentFilters.jobTypes)
      .filter(([_, isActive]) => isActive)
      .map(([type]) => {
        switch (type) {
          case 'fulltime': return 'emploi';
          case 'internship': return 'stage';
          case 'freelance': return 'freelance';
          case 'volunteer': return 'benevolat';
          default: return type;
        }
      });
    
    if (activeJobTypes.length > 0) {
      params.typeOffre = activeJobTypes[0]; // API might only support one type at a time
    }
    
    // Experience levels
    const activeExperienceLevels = Object.entries(currentFilters.experienceLevels)
      .filter(([_, isActive]) => isActive)
      .map(([level]) => level);
    
    if (activeExperienceLevels.length > 0) {
      params.experienceLevel = activeExperienceLevels[0];
    }
    
    // Salary range
    if (currentFilters.salaryRange && currentFilters.salaryRange.length === 2) {
      params.salaryMin = currentFilters.salaryRange[0] * 1000;
      params.salaryMax = currentFilters.salaryRange[1] * 1000;
    }
    
    return params;
  };

  // Sync search input with Redux state
  useEffect(() => {
    setSearchInput(searchQuery || '');
  }, [searchQuery]);

  // Load jobs on component mount
  useEffect(() => {
    dispatch(fetchJobs({ limit: 20, offset: 0 }));
  }, [dispatch]);

  // Handle sign out
  const handleSignOut = async () => {
    const confirmSignOut = window.confirm('Are you sure you want to sign out?');
    if (!confirmSignOut) return;
    
    try {
      logout();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Handle search
  const handleSearch = (query = searchInput) => {
    const searchTerm = query.trim();
    console.log('🔍 Search triggered with:', { searchTerm, currentFilters: filters });
    
    dispatch(setSearchQuery(searchTerm));
    dispatch(resetJobs());
    
    // Build search params with current filters
    const searchParams = {
      search: searchTerm || undefined,
      limit: 20,
      offset: 0,
      // Include current filters
      category: filters.category !== 'anytime' ? filters.category : undefined,
      ...buildFilterParams(filters)
    };
    
    console.log('🔍 Final search params:', searchParams);
    dispatch(fetchJobs(searchParams));
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType, filterName, value) => {
    dispatch(toggleFilter({ filterType, filterName }));
    
    // Re-fetch jobs with new filters
    // Wait for the next tick to ensure state is updated
    setTimeout(() => {
      const updatedFilters = {
        ...filters,
        [filterType]: {
          ...filters[filterType],
          [filterName]: !filters[filterType][filterName] // toggle the value
        }
      };
      
      const searchParams = {
        search: searchQuery || undefined,
        category: updatedFilters.category !== 'anytime' ? updatedFilters.category : undefined,
        ...buildFilterParams(updatedFilters),
        limit: 20,
        offset: 0
      };
      
      dispatch(resetJobs());
      dispatch(fetchJobs(searchParams));
    }, 0);
  };
  
  // Handle salary range change
  const handleSalaryRangeChange = (range) => {
    dispatch(setSalaryRange(range));
    
    const updatedFilters = {
      ...filters,
      salaryRange: range
    };
    
    const searchParams = {
      search: searchQuery || undefined,
      category: filters.category !== 'anytime' ? filters.category : undefined,
      ...buildFilterParams(updatedFilters),
      limit: 20,
      offset: 0
    };
    
    dispatch(resetJobs());
    dispatch(fetchJobs(searchParams));
  };
  
  // Handle category change
  const handleCategoryChange = (category) => {
    console.log('🏷️ Category changed to:', category);
    dispatch(setFilters({ category }));
    
    const searchParams = {
      search: searchQuery || undefined,
      category: category !== 'anytime' ? category : undefined,
      ...buildFilterParams(filters),
      limit: 20,
      offset: 0
    };
    
    console.log('🏷️ Category search params:', searchParams);
    dispatch(resetJobs());
    dispatch(fetchJobs(searchParams));
  };
  
  // Handle bookmark
  const handleBookmark = async (jobId, isBookmarked) => {
    setIsBookmarking(true);
    try {
      await dispatch(bookmarkJob({ jobId, isBookmarked })).unwrap();
    } catch (error) {
      console.error('Error bookmarking job:', error);
    } finally {
      setIsBookmarking(false);
    }
  };
  
  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      const searchParams = {
        search: searchQuery || undefined,
        category: filters.category !== 'anytime' ? filters.category : undefined,
        ...buildFilterParams(filters),
        limit: 20,
        offset: jobs.length
      };
      
      dispatch(fetchJobs(searchParams));
    }
  };
  
  // Handle job application
  const handleApplyToJob = (job) => {
    const transformedJob = transformJobData(job);
    setSelectedJob(transformedJob);
    setIsApplicationModalOpen(true);
  };
  
  // Handle application submission
  const handleApplicationSubmit = async (applicationData) => {
    try {
      await dispatch(submitJobApplication(applicationData)).unwrap();
      setIsApplicationModalOpen(false);
      setSelectedJob(null);
      // Show success notification (you could add a toast notification here)
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };
  
  // Handle modal close
  const handleApplicationModalClose = () => {
    setIsApplicationModalOpen(false);
    setSelectedJob(null);
    dispatch(clearApplicationError());
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
    const companyName = company || 'Unknown';
    const firstLetter = companyName.charAt(0).toUpperCase();
    
    // Generate a consistent color based on company name
    const colors = [
      'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 
      'bg-indigo-600', 'bg-pink-600', 'bg-yellow-600', 'bg-teal-600'
    ];
    const colorIndex = companyName.length % colors.length;
    const bgColor = colors[colorIndex];
    
    return (
      <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
        <span className="text-white font-bold text-lg">{firstLetter}</span>
      </div>
    );
  };
  
  // Transform backend job data to display format
  const transformJobData = (job) => {
    return {
      id: job.id,
      title: job.titre,
      company: job.entrepriseNom || 'Company',
      verified: true, // Assume all published jobs are verified
      level: job.niveauEtude || 'Entry',
      budget: job.salaire || 'Negotiable',
      description: job.description,
      skills: job.competencesRequises ? job.competencesRequises.split(',').map(s => s.trim()) : [],
      rating: 5, // Default rating
      posted: job.datePublication ? 
        `Posted ${new Date(job.datePublication).toLocaleDateString()}` : 
        'Recently posted',
      location: job.localisation,
      typeOffre: job.typeOffre,
      isBookmarked: bookmarkedJobs.includes(job.id)
    };
  };


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
      {/* <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold text-blue-600">Dokarti</div>
              <div className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-600 hover:text-gray-900">Find Jobs</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Companies</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Freelancers</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5 text-gray-600" />
              </Button>
              
              <div className="relative" ref={menuRef}>
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <User className="h-5 w-5" />
                  <span>{user?.firstName || 'Student'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="inline w-4 h-4 mr-2" />
                        Profile
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="inline w-4 h-4 mr-2" />
                        Settings
                      </a>
                      <hr className="my-1" />
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="inline w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Filter Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Filter</h2>
            
            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">Category</label>
              <select 
                value={filters.category || 'anytime'} 
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="anytime">All Categories</option>
                <option value="design">Design & Creative</option>
                <option value="development">Development & IT</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="sales">Sales</option>
              </select>
            </div>

            {/* Job Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">Job Type</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="fulltime" 
                    checked={filters.jobTypes.fulltime}
                    onCheckedChange={(checked) => handleFilterChange('jobTypes', 'fulltime', checked)}
                  />
                  <label htmlFor="fulltime" className="text-sm text-gray-700">Full-time</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="internship" 
                    checked={filters.jobTypes.internship}
                    onCheckedChange={(checked) => handleFilterChange('jobTypes', 'internship', checked)}
                  />
                  <label htmlFor="internship" className="text-sm text-gray-700">Internship</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="freelance" 
                    checked={filters.jobTypes.freelance}
                    onCheckedChange={(checked) => handleFilterChange('jobTypes', 'freelance', checked)}
                  />
                  <label htmlFor="freelance" className="text-sm text-gray-700">Freelance</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="volunteer" 
                    checked={filters.jobTypes.volunteer}
                    onCheckedChange={(checked) => handleFilterChange('jobTypes', 'volunteer', checked)}
                  />
                  <label htmlFor="volunteer" className="text-sm text-gray-700">Volunteer</label>
                </div>
              </div>
            </div>

            {/* Experience Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">Experience level</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="entry" 
                    checked={filters.experienceLevels.entry}
                    onCheckedChange={(checked) => handleFilterChange('experienceLevels', 'entry', checked)}
                  />
                  <label htmlFor="entry" className="text-sm text-gray-700">Entry level</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="intermediate" 
                    checked={filters.experienceLevels.intermediate}
                    onCheckedChange={(checked) => handleFilterChange('experienceLevels', 'intermediate', checked)}
                  />
                  <label htmlFor="intermediate" className="text-sm text-gray-700">Intermediate</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="expert" 
                    checked={filters.experienceLevels.expert}
                    onCheckedChange={(checked) => handleFilterChange('experienceLevels', 'expert', checked)}
                  />
                  <label htmlFor="expert" className="text-sm text-gray-700">Expert</label>
                </div>
              </div>
            </div>

            {/* Expected Salary */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">Expected salary (k)</label>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>${filters.salaryRange[0]}k</span>
                  <span>${filters.salaryRange[1]}k</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={200}
                  step={5}
                  value={filters.salaryRange[1]}
                  onChange={(e) => handleSalaryRangeChange([filters.salaryRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-12 pr-32 py-3 border-0 rounded-xl text-gray-900 placeholder-gray-500 bg-white"
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
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
            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Jobs</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={() => dispatch(fetchJobs({ limit: 20, offset: 0 }))}>
                    Try Again
                  </Button>
                </div>
              </div>
            )}
            
            {/* Loading State */}
            {isLoading && jobs.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading amazing job opportunities...</p>
                </div>
              </div>
            )}
            
            {/* Jobs Grid */}
            {!error && !isLoading && (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {jobs.map((job) => {
                    const transformedJob = transformJobData(job);
                    return (
                      <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                        <CardContent className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <CompanyLogo company={transformedJob.company} />
                              <div>
                                <h3 className="font-semibold text-base text-gray-900 mb-1">
                                  {transformedJob.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span>{transformedJob.company}</span>
                                  {transformedJob.verified && (
                                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleBookmark(job.id, transformedJob.isBookmarked)}
                              className={`text-gray-400 hover:text-gray-600 ${transformedJob.isBookmarked ? 'text-blue-600' : ''}`}
                              disabled={isBookmarking}
                            >
                              <Bookmark className={`w-5 h-5 ${transformedJob.isBookmarked ? 'fill-current' : ''}`} />
                            </Button>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {transformedJob.description}
                          </p>

                          {/* Type and Location */}
                          <div className="flex gap-2 mb-4">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                              {transformedJob.typeOffre === 'emploi' ? 'Full-time' : 'Internship'}
                            </Badge>
                            {transformedJob.location && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                                {transformedJob.location}
                              </Badge>
                            )}
                            {transformedJob.budget !== 'Negotiable' && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                {transformedJob.budget}
                              </Badge>
                            )}
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {transformedJob.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50">
                                {skill}
                              </Badge>
                            ))}
                            {transformedJob.skills.length > 3 && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50">
                                +{transformedJob.skills.length - 3} more
                              </Badge>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                              <StarRating rating={transformedJob.rating} />
                              <span className="text-xs text-gray-500">{transformedJob.posted}</span>
                            </div>
                            <Button
                              onClick={() => handleApplyToJob(job)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Apply Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {/* Load More Button */}
                {hasMore && jobs.length > 0 && (
                  <div className="text-center mt-8">
                    <Button 
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading more...
                        </>
                      ) : (
                        'Load More Jobs'
                      )}
                    </Button>
                  </div>
                )}
                
                {/* No Jobs Found */}
                {jobs.length === 0 && !isLoading && !error && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-16 w-16 mx-auto mb-4" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery ? 
                        `No jobs match your search "${searchQuery}". Try different keywords or filters.` :
                        'Try adjusting your filters or search criteria.'
                      }
                    </p>
                    <Button onClick={() => {
                      setSearchInput('');
                      dispatch(setSearchQuery(''));
                      dispatch(resetJobs());
                      dispatch(fetchJobs({ limit: 20, offset: 0 }));
                    }}>
                      Show All Jobs
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Job Application Modal */}
      <JobApplicationModal
        job={selectedJob}
        isOpen={isApplicationModalOpen}
        onClose={handleApplicationModalClose}
        onSubmit={handleApplicationSubmit}
        isSubmitting={isSubmitting}
        error={applicationError}
      />
    </div>
  );
};

export default DokartiHomepage;