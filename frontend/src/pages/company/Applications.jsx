import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchApplications,
  updateApplicationStatus,
  bulkUpdateApplications
} from '../../store/slices/applicationsSlice';
import companyApplicationsApi from '../../services/companyApplicationsApi';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Users, 
  Filter, 
  Search, 
  Download,
  Mail,
  Calendar,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  ArrowUpDown,
  FileText,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Grid,
  List,
  RefreshCw
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import ApplicationCard from '../../components/company/ApplicationCard';
import CandidateProfile from '../../components/company/CandidateProfile';
import BulkActionsBar from '../../components/company/BulkActionsBar';

const Applications = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCandidateProfile, setShowCandidateProfile] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const [filters, setFilters] = useState({
    status: 'all',
    experience: 'all',
    location: 'all',
    education: 'all',
    rating: 'all',
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Fetch applications from backend
  const fetchApplicationsData = async () => {
    try {
      setLoading(true);
      const params = {
        jobId,
        search: searchTerm,
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      
      // Remove 'all' values and empty search
      Object.keys(params).forEach(key => {
        if (params[key] === 'all' || params[key] === '') {
          delete params[key];
        }
      });
      
      console.log('Fetching applications with params:', params);
      const response = await companyApplicationsApi.getApplications(params);
      
      if (response.success) {
        setApplications(response.data.applications || []);
        setStats(response.data.stats || {});
        setPagination(response.data.pagination || pagination);
      } else {
        toast.error('Erreur lors du chargement des candidatures');
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Erreur lors du chargement des candidatures');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchApplicationsData();
    }, searchTerm ? 500 : 0); // 500ms delay for search, immediate for other changes

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Load applications when filters or pagination change (immediate)
  useEffect(() => {
    fetchApplicationsData();
  }, [jobId, filters, pagination.page]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'soumise': { color: 'bg-blue-100 text-blue-800', label: 'Soumise', icon: FileText },
      'en_cours': { color: 'bg-yellow-100 text-yellow-800', label: 'En Cours', icon: Eye },
      'acceptee': { color: 'bg-green-100 text-green-800', label: 'Acceptée', icon: CheckCircle },
      'refusee': { color: 'bg-red-100 text-red-800', label: 'Refusée', icon: XCircle },
      'annulee': { color: 'bg-gray-100 text-gray-800', label: 'Annulée', icon: Clock },
      // Legacy statuses for compatibility
      'applied': { color: 'bg-blue-100 text-blue-800', label: 'Applied', icon: FileText },
      'under_review': { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review', icon: Eye },
      'shortlisted': { color: 'bg-purple-100 text-purple-800', label: 'Shortlisted', icon: Star },
      'interviewed': { color: 'bg-orange-100 text-orange-800', label: 'Interviewed', icon: Calendar },
      'hired': { color: 'bg-green-100 text-green-800', label: 'Hired', icon: CheckCircle },
      'rejected': { color: 'bg-red-100 text-red-800', label: 'Rejected', icon: XCircle },
      'on_hold': { color: 'bg-gray-100 text-gray-800', label: 'On Hold', icon: Clock }
    };

    const config = statusConfig[status] || statusConfig['soumise'];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} px-3 py-1 text-sm font-medium flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Applications are now filtered on the backend, so we just use them directly
  const filteredApplications = applications;

  const handleSelectApplication = (applicationId) => {
    setSelectedApplications(prev => {
      const isSelected = prev.includes(applicationId);
      const newSelection = isSelected 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
      setShowBulkActions(false);
    } else {
      const allIds = filteredApplications.map(app => app.id);
      setSelectedApplications(allIds);
      setShowBulkActions(true);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus, notes = '') => {
    try {
      console.log('Update status:', applicationId, newStatus);
      await companyApplicationsApi.updateApplicationStatus(applicationId, newStatus, notes);
      toast.success('Statut mis à jour avec succès');
      // Refresh applications list
      fetchApplicationsData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleViewCandidate = async (application) => {
    try {
      const candidateDetails = await companyApplicationsApi.getCandidateDetails(
        application.id, 
        application.candidateId
      );
      
      // Ensure proper data formatting before setting candidate
      const formattedCandidate = {
        ...application,
        ...candidateDetails.data,
        // Ensure rating is a number
        rating: typeof candidateDetails.data.rating === 'number' ? candidateDetails.data.rating : (application.rating || 0),
        // Ensure skills is an array
        skills: Array.isArray(candidateDetails.data.skills) ? candidateDetails.data.skills : (application.skills || []),
        // Handle education object properly
        education: candidateDetails.data.education || application.education || 'Non renseigné'
      };
      
      setSelectedCandidate(formattedCandidate);
      setShowCandidateProfile(true);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      toast.error('Erreur lors du chargement du profil candidat');
    }
  };

  const handleBulkAction = async (action, applicationIds) => {
    try {
      console.log('Bulk action:', action, applicationIds);
      await companyApplicationsApi.bulkUpdateApplications(applicationIds, action, '');
      toast.success(`${applicationIds.length} candidature(s) mise(s) à jour`);
      setSelectedApplications([]);
      setShowBulkActions(false);
      // Refresh applications list
      fetchApplicationsData();
    } catch (error) {
      console.error('Error with bulk action:', error);
      toast.error('Erreur lors de l\'action groupée');
    }
  };

  // Status counts come from the backend stats
  const statusCounts = stats || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
              <p className="text-gray-600 mt-1">Manage and review candidate applications</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Templates
              </Button>
              <Button 
                onClick={fetchApplicationsData}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
              <div className="text-sm text-blue-700">Total Applications</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.en_cours || 0}</div>
              <div className="text-sm text-yellow-700">En Cours</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{statusCounts.shortlisted || 0}</div>
              <div className="text-sm text-purple-700">Shortlisted</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{statusCounts.interviewed || 0}</div>
              <div className="text-sm text-orange-700">Interviewed</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{statusCounts.acceptee || 0}</div>
              <div className="text-sm text-green-700">Acceptée</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{statusCounts.refusee || 0}</div>
              <div className="text-sm text-red-700">Refusée</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{statusCounts.annulee || 0}</div>
              <div className="text-sm text-gray-700">Annulée</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-blue-50 border-blue-200' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm text-gray-500">
                {filteredApplications.length} of {applications.length} applications
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous les Statuts</option>
                    <option value="soumise">Soumise</option>
                    <option value="en_cours">En Cours</option>
                    <option value="acceptee">Acceptée</option>
                    <option value="refusee">Refusée</option>
                    <option value="annulee">Annulée</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Experience</option>
                    <option value="0-2 years">0-2 years</option>
                    <option value="2-4 years">2-4 years</option>
                    <option value="4-6 years">4-6 years</option>
                    <option value="5-8 years">5-8 years</option>
                    <option value="7-10 years">7-10 years</option>
                    <option value="8+ years">8+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Application Date</option>
                    <option value="name">Candidate Name</option>
                    <option value="rating">Rating</option>
                    <option value="experience">Experience</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setFilters({
                      status: 'all',
                      experience: 'all',
                      location: 'all',
                      education: 'all',
                      rating: 'all',
                      dateRange: 'all',
                      sortBy: 'date',
                      sortOrder: 'desc'
                    })}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <BulkActionsBar
          selectedCount={selectedApplications.length}
          onBulkAction={handleBulkAction}
          selectedApplications={selectedApplications}
          onClose={() => {
            setSelectedApplications([]);
            setShowBulkActions(false);
          }}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg text-gray-600">Chargement des candidatures...</span>
        </div>
      )}

      {/* Applications Grid/List */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApplications.map(application => (
              <ApplicationCard
                key={application.id}
                application={application}
                isSelected={selectedApplications.includes(application.id)}
                onSelect={() => handleSelectApplication(application.id)}
                onStatusUpdate={handleStatusUpdate}
                onViewCandidate={() => handleViewCandidate(application)}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <label className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === filteredApplications.length}
                    onChange={handleSelectAll}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Select All</span>
                </label>
                <div className="grid grid-cols-12 gap-4 flex-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-4">Candidate</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Rating</div>
                  <div className="col-span-2">Applied</div>
                  <div className="col-span-2">Actions</div>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredApplications.map(application => (
                <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <label className="flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => handleSelectApplication(application.id)}
                        className="mr-2"
                      />
                    </label>
                    <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                      <div className="col-span-4 flex items-center space-x-3">
                        <img
                          src={application.candidatePhoto}
                          alt={application.candidateName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{application.candidateName}</div>
                          <div className="text-sm text-gray-500">{application.candidateEmail}</div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        {getStatusBadge(application.status)}
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{application.rating}</span>
                        </div>
                      </div>
                      <div className="col-span-2 text-sm text-gray-500">
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </div>
                      <div className="col-span-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCandidate(application)}
                          className="mr-2"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {searchTerm || filters.status !== 'all' 
                ? 'Try adjusting your search or filters to see more results.'
                : 'No applications have been received yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Candidate Profile Modal */}
      {showCandidateProfile && selectedCandidate && (
        <CandidateProfile
          candidate={selectedCandidate}
          isOpen={showCandidateProfile}
          onClose={() => {
            setShowCandidateProfile(false);
            setSelectedCandidate(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default Applications;