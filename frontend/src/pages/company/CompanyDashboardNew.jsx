import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Briefcase, Users, Eye, Edit2, Trash2, Search, Filter, AlertCircle, CheckCircle, Clock, Archive } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import API from '../../services/api';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalOffers: 0,
    activeOffers: 0,
    totalApplications: 0,
    avgApplicationsPerOffer: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
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

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch company offers and stats in parallel
      const [offersResponse, statsResponse] = await Promise.all([
        API.get('/opportunites/company/offers'),
        API.get('/opportunites/company/stats')
      ]);

      setJobs(offersResponse.data.offers || []);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you have company permissions.');
      } else {
        alert('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Create new job offer
  const handleCreateJob = async () => {
    try {
      const payload = {
        ...formData,
        entrepriseId: user.id
      };

      const response = await API.post('/opportunites', payload);
      
      if (response.data) {
        alert('Job offer created successfully!');
        setShowCreateDialog(false);
        resetForm();
        fetchDashboardData(); // Refresh the data
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert(error.response?.data?.error || 'Failed to create job offer');
    }
  };

  // Update job offer
  const handleUpdateJob = async () => {
    try {
      const response = await API.put(`/opportunites/${editingJob.id}`, formData);
      
      if (response.data) {
        alert('Job offer updated successfully!');
        setShowEditDialog(false);
        setEditingJob(null);
        resetForm();
        fetchDashboardData(); // Refresh the data
      }
    } catch (error) {
      console.error('Error updating job:', error);
      alert(error.response?.data?.error || 'Failed to update job offer');
    }
  };

  // Delete job offer
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job offer?')) {
      return;
    }

    try {
      const response = await API.delete(`/opportunites/${jobId}`);
      
      if (response.data) {
        alert(response.data.message);
        fetchDashboardData(); // Refresh the data
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert(error.response?.data?.error || 'Failed to delete job offer');
    }
  };

  // Edit job offer
  const handleEditJob = (job) => {
    setEditingJob(job);
    setFormData({
      titre: job.titre,
      description: job.description,
      typeOffre: job.typeOffre,
      localisation: job.localisation || '',
      salaire: job.salaire || '',
      niveauEtude: job.niveauEtude || '',
      competencesRequises: job.competencesRequises || '',
      dateExpiration: job.dateExpiration ? job.dateExpiration.split('T')[0] : '',
      nombrePostes: job.nombrePostes || 1,
      statut: job.statut,
      // Reset type-specific fields
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
    setShowEditDialog(true);
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
  };

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.localisation && job.localisation.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === '' || job.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status badge component
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

  // Job form component
  const JobForm = ({ isEdit = false }) => (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="titre">Job Title *</Label>
          <Input
            id="titre"
            value={formData.titre}
            onChange={(e) => handleInputChange('titre', e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
          />
        </div>
        <div>
          <Label htmlFor="typeOffre">Job Type *</Label>
          <Select value={formData.typeOffre} onValueChange={(value) => handleInputChange('typeOffre', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emploi">Job</SelectItem>
              <SelectItem value="stage">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the role, responsibilities, and requirements..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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

      <div className="grid grid-cols-2 gap-4">
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
            onChange={(e) => handleInputChange('nombrePostes', parseInt(e.target.value))}
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
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
          <Select value={formData.statut} onValueChange={(value) => handleInputChange('statut', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brouillon">Draft</SelectItem>
              <SelectItem value="publiee">Published</SelectItem>
              <SelectItem value="archivee">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Job-specific fields */}
      {formData.typeOffre === 'emploi' && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Employment Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="typeContrat">Contract Type</Label>
              <Select value={formData.typeContrat} onValueChange={(value) => handleInputChange('typeContrat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">Permanent (CDI)</SelectItem>
                  <SelectItem value="CDD">Fixed-term (CDD)</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="temps_partiel">Part-time</SelectItem>
                </SelectContent>
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
          <div className="mt-4">
            <Label htmlFor="avantages">Benefits</Label>
            <Textarea
              id="avantages"
              value={formData.avantages}
              onChange={(e) => handleInputChange('avantages', e.target.value)}
              placeholder="List benefits and perks..."
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Internship-specific fields */}
      {formData.typeOffre === 'stage' && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Internship Details</h4>
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <input
                id="estRemunere"
                type="checkbox"
                checked={formData.estRemunere}
                onChange={(e) => handleInputChange('estRemunere', e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="estRemunere">Paid Internship</Label>
            </div>
            {formData.estRemunere && (
              <div>
                <Label htmlFor="montantRemuneration">Monthly Compensation</Label>
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
          <div className="mt-4">
            <Label htmlFor="objectifs">Objectives</Label>
            <Textarea
              id="objectifs"
              value={formData.objectifs}
              onChange={(e) => handleInputChange('objectifs', e.target.value)}
              placeholder="Describe the learning objectives and goals..."
              rows={2}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          onClick={isEdit ? handleUpdateJob : handleCreateJob}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isEdit ? 'Update Job' : 'Create Job'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setShowEditDialog(false);
              setEditingJob(null);
            } else {
              setShowCreateDialog(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Create New Job Offer</DialogTitle>
                </DialogHeader>
                <JobForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalOffers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Jobs</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeOffers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Applicants</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalApplications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg. Applications</CardTitle>
              <div className="h-4 w-4 bg-orange-500 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.avgApplicationsPerOffer}</div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Job Postings ({filteredJobs.length})</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs..."
                    className="pl-9 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="publiee">Active</SelectItem>
                    <SelectItem value="brouillon">Draft</SelectItem>
                    <SelectItem value="archivee">Archived</SelectItem>
                    <SelectItem value="expiree">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
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
                  {filteredJobs.length === 0 ? (
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
                          <span className="font-medium text-gray-900">{job.applicants}</span>
                          <span className="text-sm text-gray-500"> applications</span>
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {new Date(job.datePublication || job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
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
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Job Offer</DialogTitle>
          </DialogHeader>
          <JobForm isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDashboard;