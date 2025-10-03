import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchApplications,
  updateApplicationStatus,
  bulkUpdateApplications
} from '../../store/slices/applicationsSlice';
import { useParams } from 'react-router-dom';
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

  // Mock applications data
  const applications = [
    {
      id: 1,
      candidateId: 101,
      jobId: jobId || 1,
      candidateName: 'Sarah Johnson',
      candidateEmail: 'sarah.johnson@email.com',
      candidatePhone: '+1 (555) 123-4567',
      candidateLocation: 'New York, NY',
      candidatePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150',
      position: 'Senior UI/UX Designer',
      appliedDate: '2024-01-15T10:30:00Z',
      status: 'under_review',
      rating: 4.5,
      experience: '5-8 years',
      education: 'Bachelor in Design',
      resumeUrl: '/documents/sarah-johnson-resume.pdf',
      coverLetter: 'I am excited to apply for the Senior UI/UX Designer position...',
      portfolio: 'https://sarahjohnson.design',
      skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research'],
      notes: 'Strong portfolio, good communication skills',
      interviewScheduled: null,
      lastActivity: '2024-01-16T14:22:00Z'
    },
    {
      id: 2,
      candidateId: 102,
      jobId: jobId || 1,
      candidateName: 'Michael Chen',
      candidateEmail: 'michael.chen@email.com',
      candidatePhone: '+1 (555) 987-6543',
      candidateLocation: 'San Francisco, CA',
      candidatePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      position: 'Senior UI/UX Designer',
      appliedDate: '2024-01-14T09:15:00Z',
      status: 'shortlisted',
      rating: 4.8,
      experience: '7-10 years',
      education: 'Master in HCI',
      resumeUrl: '/documents/michael-chen-resume.pdf',
      coverLetter: 'With over 7 years of experience in UX design...',
      portfolio: 'https://michaelchen.dev',
      skills: ['React', 'Figma', 'Design Systems', 'A/B Testing', 'Analytics'],
      notes: 'Excellent technical background',
      interviewScheduled: '2024-01-20T15:00:00Z',
      lastActivity: '2024-01-17T11:45:00Z'
    },
    {
      id: 3,
      candidateId: 103,
      jobId: jobId || 1,
      candidateName: 'Emily Rodriguez',
      candidateEmail: 'emily.rodriguez@email.com',
      candidatePhone: '+1 (555) 456-7890',
      candidateLocation: 'Austin, TX',
      candidatePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      position: 'Senior UI/UX Designer',
      appliedDate: '2024-01-13T16:45:00Z',
      status: 'interviewed',
      rating: 4.2,
      experience: '4-6 years',
      education: 'Bachelor in Psychology',
      resumeUrl: '/documents/emily-rodriguez-resume.pdf',
      coverLetter: 'I bring a unique perspective combining psychology and design...',
      portfolio: 'https://emilyuxdesign.com',
      skills: ['User Research', 'Wireframing', 'Usability Testing', 'Figma'],
      notes: 'Great interview performance, strong user research skills',
      interviewScheduled: '2024-01-18T10:00:00Z',
      lastActivity: '2024-01-18T16:30:00Z'
    },
    {
      id: 4,
      candidateId: 104,
      jobId: jobId || 1,
      candidateName: 'David Kim',
      candidateEmail: 'david.kim@email.com',
      candidatePhone: '+1 (555) 321-0987',
      candidateLocation: 'Seattle, WA',
      candidatePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      position: 'Senior UI/UX Designer',
      appliedDate: '2024-01-12T14:20:00Z',
      status: 'rejected',
      rating: 3.1,
      experience: '2-4 years',
      education: 'Bachelor in Computer Science',
      resumeUrl: '/documents/david-kim-resume.pdf',
      coverLetter: 'As a developer transitioning to UX design...',
      portfolio: null,
      skills: ['HTML/CSS', 'JavaScript', 'Basic Design'],
      notes: 'Lacks design experience, strong technical background',
      interviewScheduled: null,
      lastActivity: '2024-01-15T09:10:00Z'
    },
    {
      id: 5,
      candidateId: 105,
      jobId: jobId || 1,
      candidateName: 'Lisa Thompson',
      candidateEmail: 'lisa.thompson@email.com',
      candidatePhone: '+1 (555) 654-3210',
      candidateLocation: 'Remote',
      candidatePhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
      position: 'Senior UI/UX Designer',
      appliedDate: '2024-01-11T11:30:00Z',
      status: 'hired',
      rating: 4.9,
      experience: '8+ years',
      education: 'Master in Design',
      resumeUrl: '/documents/lisa-thompson-resume.pdf',
      coverLetter: 'I am thrilled to apply for this position...',
      portfolio: 'https://lisathompsonux.com',
      skills: ['Design Leadership', 'Strategy', 'Mentoring', 'Figma', 'Research'],
      notes: 'Perfect fit, hired!',
      interviewScheduled: null,
      lastActivity: '2024-01-19T13:20:00Z'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'applied': { color: 'bg-blue-100 text-blue-800', label: 'Applied', icon: FileText },
      'under_review': { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review', icon: Eye },
      'shortlisted': { color: 'bg-purple-100 text-purple-800', label: 'Shortlisted', icon: Star },
      'interviewed': { color: 'bg-orange-100 text-orange-800', label: 'Interviewed', icon: Calendar },
      'hired': { color: 'bg-green-100 text-green-800', label: 'Hired', icon: CheckCircle },
      'rejected': { color: 'bg-red-100 text-red-800', label: 'Rejected', icon: XCircle },
      'on_hold': { color: 'bg-gray-100 text-gray-800', label: 'On Hold', icon: Clock }
    };

    const config = statusConfig[status] || statusConfig['applied'];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} px-3 py-1 text-sm font-medium flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredApplications = useMemo(() => {
    let filtered = applications.filter(app => {
      const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = filters.status === 'all' || app.status === filters.status;
      const matchesExperience = filters.experience === 'all' || app.experience === filters.experience;
      const matchesLocation = filters.location === 'all' || 
                             app.candidateLocation.toLowerCase().includes(filters.location.toLowerCase());
      const matchesRating = filters.rating === 'all' || app.rating >= parseFloat(filters.rating);

      return matchesSearch && matchesStatus && matchesExperience && matchesLocation && matchesRating;
    });

    // Sort applications
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.candidateName;
          bValue = b.candidateName;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'experience':
          aValue = a.experience;
          bValue = b.experience;
          break;
        case 'date':
        default:
          aValue = new Date(a.appliedDate);
          bValue = new Date(b.appliedDate);
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [applications, searchTerm, filters]);

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

  const handleStatusUpdate = (applicationId, newStatus) => {
    // Implement status update logic
    console.log('Update status:', applicationId, newStatus);
  };

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateProfile(true);
  };

  const handleBulkAction = (action, applicationIds) => {
    console.log('Bulk action:', action, applicationIds);
    // Implement bulk action logic
    setSelectedApplications([]);
    setShowBulkActions(false);
  };

  const statusCounts = useMemo(() => {
    const counts = {};
    applications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return counts;
  }, [applications]);

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
              <Button className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 mr-2" />
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
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.under_review || 0}</div>
              <div className="text-sm text-yellow-700">Under Review</div>
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
              <div className="text-2xl font-bold text-green-600">{statusCounts.hired || 0}</div>
              <div className="text-sm text-green-700">Hired</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected || 0}</div>
              <div className="text-sm text-red-700">Rejected</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{statusCounts.on_hold || 0}</div>
              <div className="text-sm text-gray-700">On Hold</div>
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
                    <option value="all">All Status</option>
                    <option value="applied">Applied</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                    <option value="on_hold">On Hold</option>
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