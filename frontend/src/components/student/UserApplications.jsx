import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  getUserApplications,
  getApplicationDetails,
  clearError
} from '../../store/slices/applicationSlice';

const UserApplications = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState('all');

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
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_review':
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    if (selectedTab === 'all') return true;
    if (selectedTab === 'pending') return app.status === 'pending';
    if (selectedTab === 'accepted') return ['accepted', 'hired'].includes(app.status);
    if (selectedTab === 'rejected') return app.status === 'rejected';
    return true;
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
  };

  if (isLoading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Applications</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => dispatch(getUserApplications())}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track the status of your job applications</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applicationStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{applicationStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{applicationStats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{applicationStats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Application History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({applicationStats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({applicationStats.pending})</TabsTrigger>
              <TabsTrigger value="accepted">Accepted ({applicationStats.accepted})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({applicationStats.rejected})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedTab === 'all' ? 'No applications yet' : `No ${selectedTab} applications`}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedTab === 'all' 
                      ? 'Start applying to jobs to see them here' 
                      : `No applications with ${selectedTab} status found`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <div
                      key={application._id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold">
                                {application.job?.company?.charAt(0) || application.company?.charAt(0) || 'J'}
                              </span>
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {application.job?.title || application.jobTitle || 'Job Title'}
                              </h3>
                              
                              <p className="text-sm text-gray-600 mb-2">
                                {application.job?.company || application.company || 'Company Name'}
                              </p>
                              
                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4" />
                                  Applied {formatDate(application.appliedAt || application.createdAt)}
                                </div>
                                
                                {application.job?.location && (
                                  <div className="text-sm text-gray-500">
                                    📍 {application.job.location}
                                  </div>
                                )}
                              </div>
                              
                              <Badge className={`${getStatusColor(application.status)} border-none`}>
                                {getStatusIcon(application.status)}
                                <span className="ml-1 capitalize">
                                  {application.status?.replace('_', ' ') || 'Pending'}
                                </span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(application._id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          
                          {application.resumeUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(application.resumeUrl, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Resume
                            </Button>
                          )}
                          
                          {application.job?.url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(application.job.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Job
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {application.coverLetter && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600 font-medium mb-1">Cover Letter Preview:</p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {application.coverLetter}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserApplications;