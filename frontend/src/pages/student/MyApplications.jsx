import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  Eye,
  Download,
  ExternalLink,
  ArrowLeft,
  Filter,
  Search,
  TrendingUp,
  Building,
  MapPin,
  DollarSign,
  User,
  Mail,
  Bookmark
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  getUserApplications,
  getApplicationDetails,
  clearError
} from '../../store/slices/applicationSlice';
import { useAuth } from '../../contexts/AuthContext';

const MyApplications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const {
    applications,
    currentApplication,
    isLoading,
    error,
    applicationStats
  } = useSelector((state) => state.studentApplications);

  useEffect(() => {
    dispatch(getUserApplications());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
      case 'hired':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_review':
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
      case 'hired':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'in_review':
      case 'under_review':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'pending' && app.status === 'pending') ||
                      (selectedTab === 'accepted' && ['accepted', 'hired'].includes(app.status)) ||
                      (selectedTab === 'rejected' && app.status === 'rejected');
    
    const matchesSearch = !searchQuery || 
                         app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.job?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (applicationId) => {
    dispatch(getApplicationDetails(applicationId));
    setShowDetails(true);
  };

  const handleBackToJobs = () => {
    navigate('/student/dashboard');
  };

  if (isLoading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-20">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Applications</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => dispatch(getUserApplications())}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToJobs}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Jobs
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-600 mt-1">Track and manage your job applications</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>{user?.firstName} {user?.lastName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-900">{applicationStats.total}</p>
                  <p className="text-xs text-blue-600 mt-1">All time</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <FileText className="h-8 w-8 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Pending</p>
                  <p className="text-3xl font-bold text-yellow-900">{applicationStats.pending}</p>
                  <p className="text-xs text-yellow-600 mt-1">Under review</p>
                </div>
                <div className="p-3 bg-yellow-200 rounded-full">
                  <Clock className="h-8 w-8 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Accepted</p>
                  <p className="text-3xl font-bold text-green-900">{applicationStats.accepted}</p>
                  <p className="text-xs text-green-600 mt-1">Success rate</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Rejected</p>
                  <p className="text-3xl font-bold text-red-900">{applicationStats.rejected}</p>
                  <p className="text-xs text-red-600 mt-1">Learning opportunities</p>
                </div>
                <div className="p-3 bg-red-200 rounded-full">
                  <XCircle className="h-8 w-8 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search applications by job title or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {filteredApplications.length} of {applications.length} applications
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Application History</CardTitle>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">
                  {applicationStats.accepted > 0 && 
                    `${Math.round((applicationStats.accepted / applicationStats.total) * 100)}% success rate`
                  }
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <span>All</span>
                  <Badge variant="secondary" className="text-xs">
                    {applicationStats.total}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <span>Pending</span>
                  <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                    {applicationStats.pending}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="accepted" className="flex items-center gap-2">
                  <span>Accepted</span>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    {applicationStats.accepted}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2">
                  <span>Rejected</span>
                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                    {applicationStats.rejected}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={selectedTab} className="mt-6">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      {selectedTab === 'all' ? (
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      ) : (
                        getStatusIcon(selectedTab)
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchQuery ? 
                        'No matching applications found' : 
                        (selectedTab === 'all' ? 'No applications yet' : `No ${selectedTab} applications`)
                      }
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery ? 
                        'Try adjusting your search terms' :
                        (selectedTab === 'all' ? 
                          'Start applying to jobs to see them here' : 
                          `No applications with ${selectedTab} status found`
                        )
                      }
                    </p>
                    {selectedTab === 'all' && !searchQuery && (
                      <Button onClick={handleBackToJobs} className="bg-blue-600 hover:bg-blue-700">
                        Browse Jobs
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map((application, index) => (
                      <div
                        key={application._id || index}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-white"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">
                                  {(application.job?.company || application.company || 'C').charAt(0)}
                                </span>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                      {application.job?.title || application.jobTitle || 'Job Title'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                      <Building className="h-4 w-4" />
                                      <span>{application.job?.company || application.company || 'Company Name'}</span>
                                    </div>
                                  </div>
                                  <Badge className={`${getStatusColor(application.status)} border`}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(application.status)}
                                      <span className="capitalize">
                                        {application.status?.replace('_', ' ') || 'Pending'}
                                      </span>
                                    </div>
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Applied {formatDate(application.appliedAt || application.createdAt)}
                                  </div>
                                  
                                  {application.job?.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {application.job.location}
                                    </div>
                                  )}
                                  
                                  {application.job?.type && (
                                    <div className="flex items-center gap-1">
                                      <Badge variant="outline" className="text-xs">
                                        {application.job.type === 'emploi' ? 'Full-time' : 'Internship'}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                
                                {application.coverLetter && (
                                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                                    <p className="text-xs font-medium text-gray-600 mb-1">Cover Letter Preview:</p>
                                    <p className="text-sm text-gray-700 line-clamp-2">
                                      {application.coverLetter.substring(0, 120)}...
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(application._id)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              Details
                            </Button>
                            
                            {application.resumeUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(application.resumeUrl, '_blank')}
                                className="flex items-center gap-1"
                              >
                                <Download className="h-4 w-4" />
                                Resume
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyApplications;