import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Briefcase, Users, Eye, Edit2, Trash2, Search, Filter, AlertCircle, CheckCircle, Clock, Archive } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent, DrawerFooter } from '../../components/ui/drawer';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectItem } from '../../components/ui/select';
import JobDetailsModal from '../../components/company/JobDetailsModal';
import JobFilters from '../../components/company/JobFilters';
import { 
  fetchCompanyStats, 
  fetchCompanyJobs, 
  createCompanyJob,
  updateCompanyJob,
  deleteCompanyJob,
  setFilters,
  clearErrors
} from '../../store/slices/companySlice';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  // Job details modal state
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  
  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jobFilters, setJobFilters] = useState({
    statut: '',
    typeOffre: '',
    dateRange: '',
    sortBy: 'dateCreated',
    sortOrder: 'desc'
  });
  
  // Form state
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    typeOffre: 'emploi',
    localisation: '',
    salaire: '',
    niveauEtude: '',
    competencesRequises: '',
    dateExpiration: '',
    nombrePostes: 1,
    statut: 'brouillon',
    // Job-specific fields
    typeContrat: 'CDI',
    experienceRequise: '',
    avantages: '',
    estNegociable: false,
    // Internship-specific fields
    duree: '',
    estRemunere: false,
    montantRemuneration: '',
    dateDebut: '',
    objectifs: ''
  });
  
  // Redux selectors
  const {
    stats,
    jobs,
    isLoadingStats,
    isLoadingJobs,
    isCreatingJob,
    isUpdatingJob,
    isDeletingJob,
    statsError,
    jobsError,
    createError,
    updateError,
    deleteError,
    filters
  } = useSelector((state) => state.company);

  // Fetch data on component mount
  useEffect(() => {
    console.log('CompanyDashboard: User data:', user);
    console.log('CompanyDashboard: User role:', user?.role);
    console.log('CompanyDashboard: User ID:', user?.id);
    
    if (user?.role !== 'entreprise') {
      console.warn('CompanyDashboard: User is not a company:', user?.role);
    }
    
    dispatch(fetchCompanyStats());
    dispatch(fetchCompanyJobs());
  }, [dispatch, user]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      typeOffre: 'emploi',
      localisation: '',
      salaire: '',
      niveauEtude: '',
      competencesRequises: '',
      dateExpiration: '',
      nombrePostes: 1,
      statut: 'brouillon',
      typeContrat: 'CDI',
      experienceRequise: '',
      avantages: '',
      estNegociable: false,
      duree: '',
      estRemunere: false,
      montantRemuneration: '',
      dateDebut: '',
      objectifs: ''
    });
    setEditingJob(null);
    setIsEditing(false);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    dispatch(setFilters({ search: value }));
  };

  // Open drawer for creating new job
  const handleCreateJobClick = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  // Open drawer for editing job
  const handleEditJob = (job) => {
    setEditingJob(job);
    setIsEditing(true);
    setFormData({
      titre: job.titre || '',
      description: job.description || '',
      typeOffre: job.typeOffre || 'emploi',
      localisation: job.localisation || '',
      salaire: job.salaire || '',
      niveauEtude: job.niveauEtude || '',
      competencesRequises: job.competencesRequises || '',
      dateExpiration: job.dateExpiration ? job.dateExpiration.split('T')[0] : '',
      nombrePostes: job.nombrePostes || 1,
      statut: job.statut || 'brouillon',
      // Reset type-specific fields - these would need to be fetched from backend
      typeContrat: 'CDI',
      experienceRequise: '',
      avantages: '',
      estNegociable: false,
      duree: '',
      estRemunere: false,
      montantRemuneration: '',
      dateDebut: '',
      objectifs: ''
    });
    setIsDrawerOpen(true);
  };

  // Handle job creation
  const handleCreateJob = async () => {
    try {
      // Comprehensive validation
      const errors = [];
      
      if (!formData.titre || !formData.titre.trim()) {
        errors.push('Job Title');
      }
      
      if (!formData.description || !formData.description.trim()) {
        errors.push('Description');
      }
      
      if (!formData.typeOffre) {
        errors.push('Job Type');
      }
      
      if (errors.length > 0) {
        alert(`Please fill in the following required fields: ${errors.join(', ')}`);
        return;
      }

      if (!user?.id) {
        alert('User authentication error. Please login again.');
        console.error('User object:', user);
        return;
      }
      
      if (user.role !== 'entreprise') {
        alert('Access denied. You must be logged in as a company to create job offers.');
        console.error('User role:', user.role, 'Expected: entreprise');
        return;
      }

      console.log('Form data being sent:', formData);
      console.log('User ID:', user.id);

      // Add user ID directly to form data
      const jobDataWithUserId = {
        ...formData,
        entrepriseId: user.id
      };

      console.log('Final payload:', jobDataWithUserId);

      const result = await dispatch(createCompanyJob(jobDataWithUserId));
      if (createCompanyJob.fulfilled.match(result)) {
        setIsDrawerOpen(false);
        resetForm();
        // Refresh data
        dispatch(fetchCompanyJobs());
        dispatch(fetchCompanyStats());
        alert('Job created successfully!');
      } else {
        console.error('Creation failed:', result.payload);
        alert(result.payload?.error || 'Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job');
    }
  };

  // Handle job update
  const handleUpdateJob = async () => {
    try {
      const result = await dispatch(updateCompanyJob({ 
        jobId: editingJob.id, 
        jobData: formData 
      }));
      if (updateCompanyJob.fulfilled.match(result)) {
        setIsDrawerOpen(false);
        resetForm();
        // Refresh data
        dispatch(fetchCompanyJobs());
        dispatch(fetchCompanyStats());
        alert('Job updated successfully!');
      } else {
        alert(result.payload?.error || 'Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job');
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      const result = await dispatch(deleteCompanyJob(jobId));
      if (deleteCompanyJob.fulfilled.match(result)) {
        // Refresh stats after deletion
        dispatch(fetchCompanyStats());
        alert('Job deleted successfully!');
      } else {
        alert(result.payload?.error || 'Failed to delete job');
      }
    }
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    resetForm();
  };

  // Handle job details view
  const handleViewJob = (job) => {
    setSelectedJobForDetails(job);
    setIsJobDetailsOpen(true);
  };

  // Handle job details modal close
  const handleJobDetailsClose = () => {
    setIsJobDetailsOpen(false);
    setSelectedJobForDetails(null);
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setJobFilters(newFilters);
    // Optionally refresh jobs with new filters
    const params = {
      statut: newFilters.statut,
      typeOffre: newFilters.typeOffre,
      // Add other filter params as needed
    };
    dispatch(fetchCompanyJobs(params));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setJobFilters({
      statut: '',
      typeOffre: '',
      dateRange: '',
      sortBy: 'dateCreated',
      sortOrder: 'desc'
    });
    dispatch(fetchCompanyJobs({}));
  };

  // Apply date range filter
  const applyDateFilter = (jobs, dateRange) => {
    if (!dateRange) return jobs;
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateRange) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      default:
        return jobs;
    }
    
    return jobs.filter(job => {
      const jobDate = new Date(job.createdAt || job.datePublication);
      return jobDate >= filterDate;
    });
  };

  // Apply sorting
  const applySorting = (jobs, sortBy, sortOrder) => {
    return [...jobs].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'titre':
          aValue = a.titre?.toLowerCase() || '';
          bValue = b.titre?.toLowerCase() || '';
          break;
        case 'applicants':
          aValue = a.applicants || 0;
          bValue = b.applicants || 0;
          break;
        case 'dateCreated':
        default:
          aValue = new Date(a.createdAt || a.datePublication || 0);
          bValue = new Date(b.createdAt || b.datePublication || 0);
          break;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.localisation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (jobFilters.statut) {
      filtered = filtered.filter(job => job.statut === jobFilters.statut);
    }
    
    // Apply type filter
    if (jobFilters.typeOffre) {
      filtered = filtered.filter(job => job.typeOffre === jobFilters.typeOffre);
    }
    
    // Apply date range filter
    filtered = applyDateFilter(filtered, jobFilters.dateRange);
    
    // Apply sorting
    filtered = applySorting(filtered, jobFilters.sortBy, jobFilters.sortOrder);
    
    return filtered;
  }, [jobs, searchTerm, jobFilters]);

  const getStatusBadge = (status) => {
    const variants = {
      'publiee': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
      'brouillon': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Draft' },
      'archivee': { color: 'bg-gray-100 text-gray-800', icon: Archive, label: 'Archived' },
      'expiree': { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Expired' },
      'pourvue': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Filled' }
    };
    
    const variant = variants[status] || variants['brouillon'];
    const Icon = variant.icon;
    
    return (
      <Badge className={`${variant.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {variant.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.prenom || 'Company'}! Manage your job postings and applications.
              </p>
            </div>
            <Button 
              onClick={handleCreateJobClick}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Panel - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info:</h3>
            <div className="text-xs text-yellow-700 space-y-1">
              <div><strong>User ID:</strong> {user?.id || 'Not set'}</div>
              <div><strong>User Role:</strong> {user?.role || 'Not set'}</div>
              <div><strong>User Email:</strong> {user?.email || 'Not set'}</div>
              <div><strong>User Name:</strong> {user?.prenom} {user?.nom || 'Not set'}</div>
            </div>
          </div>
        )}
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="text-2xl font-bold text-gray-900">{stats.totalOffers}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Jobs</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="text-2xl font-bold text-green-600">{stats.activeOffers}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Applicants</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="text-2xl font-bold text-gray-900">{stats.totalApplications}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg. Applications</CardTitle>
              <div className="h-4 w-4 bg-orange-500 rounded"></div>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="text-2xl font-bold text-orange-600">{stats.avgApplicationsPerOffer}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Jobs Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">
                Job Postings ({filteredJobs.length})
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs..."
                    className="pl-9 w-64"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <JobFilters
                  filters={jobFilters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  isOpen={isFilterOpen}
                  onToggle={() => setIsFilterOpen(!isFilterOpen)}
                />
              </div>
            </div>
          </CardHeader>
          
          {/* Filters Container */}
          {isFilterOpen && (
            <div className="px-6 pb-4 border-b">
              <JobFilters
                filters={jobFilters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                isOpen={true}
                onToggle={() => setIsFilterOpen(false)}
              />
            </div>
          )}
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 text-sm font-medium text-gray-600">Job Title</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Type</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Location</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Applicants</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Posted</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingJobs ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          Loading jobs...
                        </div>
                      </td>
                    </tr>
                  ) : filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">
                        {jobs.length === 0 ? 'No job offers yet. Create your first one!' : 'No jobs match your search criteria.'}
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job, index) => (
                      <tr key={job.id} className={index !== filteredJobs.length - 1 ? 'border-b' : ''}>
                        <td className="py-4">
                          <div>
                            <div className="font-medium text-gray-900">{job.titre}</div>
                            <div className="text-sm text-gray-500">{job.salaire || 'Salary not specified'}</div>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge variant={job.typeOffre === 'emploi' ? 'default' : 'secondary'}>
                            {job.typeOffre === 'emploi' ? 'Job' : 'Internship'}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-gray-600">{job.localisation || 'Not specified'}</td>
                        <td className="py-4">{getStatusBadge(job.statut)}</td>
                        <td className="py-4">
                          <span className="font-medium text-gray-900">{job.applicants || 0}</span>
                          <span className="text-sm text-gray-500"> applications</span>
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {new Date(job.datePublication || job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:text-blue-700"
                              onClick={() => handleViewJob(job)}
                              title="View job details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-600 hover:text-gray-700"
                              onClick={() => handleEditJob(job)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteJob(job.id)}
                              disabled={isDeletingJob}
                            >
                              {isDeletingJob ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Form Drawer */}
      <Drawer open={isDrawerOpen} onClose={handleDrawerClose}>
        <DrawerHeader>
          <DrawerTitle onClose={handleDrawerClose}>
            {isEditing ? 'Edit Job Offer' : 'Create New Job Offer'}
          </DrawerTitle>
        </DrawerHeader>
        
        <DrawerContent>
          <div className="space-y-8 animate-fade-in-up">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="titre" className="text-gray-700 font-medium">
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="titre"
                    value={formData.titre}
                    onChange={(e) => handleInputChange('titre', e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className={`transition-all duration-200 focus:shadow-md focus:scale-[1.01] ${
                      !formData.titre.trim() ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    required
                  />
                  {!formData.titre.trim() && (
                    <p className="text-red-500 text-sm mt-1">Job title is required</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="typeOffre" className="text-gray-700 font-medium">
                    Job Type <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.typeOffre} 
                    onValueChange={(value) => handleInputChange('typeOffre', value)}
                  >
                    <SelectItem value="emploi">Job</SelectItem>
                    <SelectItem value="stage">Internship</SelectItem>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-700 font-medium">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={4}
                  className={`transition-all duration-200 ${
                    !formData.description.trim() ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  required
                />
                {!formData.description.trim() && (
                  <p className="text-red-500 text-sm mt-1">Description is required</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="localisation">Location</Label>
                  <Input
                    id="localisation"
                    value={formData.localisation}
                    onChange={(e) => handleInputChange('localisation', e.target.value)}
                    placeholder="e.g. Paris, Remote"
                  />
                </div>
                
                <div>
                  <Label htmlFor="salaire">Salary Range</Label>
                  <Input
                    id="salaire"
                    value={formData.salaire}
                    onChange={(e) => handleInputChange('salaire', e.target.value)}
                    placeholder="e.g. $50,000 - $80,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="niveauEtude">Education Level</Label>
                  <Input
                    id="niveauEtude"
                    value={formData.niveauEtude}
                    onChange={(e) => handleInputChange('niveauEtude', e.target.value)}
                    placeholder="e.g. Bachelor's degree"
                  />
                </div>
                
                <div>
                  <Label htmlFor="nombrePostes">Number of Positions</Label>
                  <Input
                    id="nombrePostes"
                    type="number"
                    min="1"
                    value={formData.nombrePostes}
                    onChange={(e) => handleInputChange('nombrePostes', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="competencesRequises">Required Skills</Label>
                <Textarea
                  id="competencesRequises"
                  value={formData.competencesRequises}
                  onChange={(e) => handleInputChange('competencesRequises', e.target.value)}
                  placeholder="List required skills and technologies..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateExpiration">Expiration Date</Label>
                  <Input
                    id="dateExpiration"
                    type="date"
                    value={formData.dateExpiration}
                    onChange={(e) => handleInputChange('dateExpiration', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="statut">Status</Label>
                  <Select 
                    value={formData.statut} 
                    onValueChange={(value) => handleInputChange('statut', value)}
                  >
                    <SelectItem value="brouillon">Draft</SelectItem>
                    <SelectItem value="publiee">Published</SelectItem>
                    <SelectItem value="archivee">Archived</SelectItem>
                  </Select>
                </div>
              </div>
            </div>

            {/* Job-specific fields */}
            {formData.typeOffre === 'emploi' && (
              <div className="space-y-6 pt-4 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">Employment Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="typeContrat">Contract Type</Label>
                    <Select 
                      value={formData.typeContrat} 
                      onValueChange={(value) => handleInputChange('typeContrat', value)}
                    >
                      <SelectItem value="CDI">Permanent (CDI)</SelectItem>
                      <SelectItem value="CDD">Fixed-term (CDD)</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="temps_partiel">Part-time</SelectItem>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="experienceRequise">Required Experience</Label>
                    <Input
                      id="experienceRequise"
                      value={formData.experienceRequise}
                      onChange={(e) => handleInputChange('experienceRequise', e.target.value)}
                      placeholder="e.g. 3-5 years"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="avantages">Benefits</Label>
                  <Textarea
                    id="avantages"
                    value={formData.avantages}
                    onChange={(e) => handleInputChange('avantages', e.target.value)}
                    placeholder="List benefits and perks..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="estNegociable"
                    type="checkbox"
                    checked={formData.estNegociable}
                    onChange={(e) => handleInputChange('estNegociable', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="estNegociable">Salary is negotiable</Label>
                </div>
              </div>
            )}

            {/* Internship-specific fields */}
            {formData.typeOffre === 'stage' && (
              <div className="space-y-6 pt-4 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-200">Internship Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duree">Duration</Label>
                    <Input
                      id="duree"
                      value={formData.duree}
                      onChange={(e) => handleInputChange('duree', e.target.value)}
                      placeholder="e.g. 6 months"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dateDebut">Start Date</Label>
                    <Input
                      id="dateDebut"
                      type="date"
                      value={formData.dateDebut}
                      onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      id="estRemunere"
                      type="checkbox"
                      checked={formData.estRemunere}
                      onChange={(e) => handleInputChange('estRemunere', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="estRemunere">Paid Internship</Label>
                  </div>

                  {formData.estRemunere && (
                    <div>
                      <Label htmlFor="montantRemuneration">Monthly Compensation (€)</Label>
                      <Input
                        id="montantRemuneration"
                        type="number"
                        value={formData.montantRemuneration}
                        onChange={(e) => handleInputChange('montantRemuneration', e.target.value)}
                        placeholder="e.g. 600"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="objectifs">Learning Objectives</Label>
                  <Textarea
                    id="objectifs"
                    value={formData.objectifs}
                    onChange={(e) => handleInputChange('objectifs', e.target.value)}
                    placeholder="Describe the learning objectives and goals..."
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        </DrawerContent>

        <DrawerFooter>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleDrawerClose}
              disabled={isCreatingJob || isUpdatingJob}
            >
              Cancel
            </Button>
            <Button
              onClick={isEditing ? handleUpdateJob : handleCreateJob}
              disabled={isCreatingJob || isUpdatingJob || !formData.titre.trim() || !formData.description.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {(isCreatingJob || isUpdatingJob) ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEditing ? 'Update Job' : 'Create Job'
              )}
            </Button>
          </div>
        </DrawerFooter>
      </Drawer>
      
      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJobForDetails}
        isOpen={isJobDetailsOpen}
        onClose={handleJobDetailsClose}
        onEdit={handleEditJob}
      />
    </div>
  );
};

export default CompanyDashboard;