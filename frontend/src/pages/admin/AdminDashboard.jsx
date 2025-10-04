import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Users, Briefcase, Building2, TrendingUp, Shield, Settings, Search, Filter, UserCheck, UserX, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const AdminDashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dynamic data state
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalCompanies: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingReviews: 0,
    systemHealth: 98.5,
    usersGrowth: 0
  });
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [jobData, setJobData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  
  // Loading states
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);
  const [error, setError] = useState(null);
  
  // User management state
  const [userFilters, setUserFilters] = useState({
    search: '',
    role: '',
    status: '',
    page: 1,
    limit: 10
  });
  const [userPagination, setUserPagination] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  // Data fetching functions
  const fetchDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      setError(null);
      
      const response = await adminApi.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchUsers = async (filters = userFilters) => {
    try {
      setIsLoadingUsers(true);
      
      const response = await adminApi.getUsers(filters);
      if (response.success) {
        setUsers(response.data.users);
        setUserPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      setIsLoadingAlerts(true);
      
      const response = await adminApi.getSystemAlerts();
      if (response.success) {
        setAlerts(response.data);
      }
    } catch (err) {
      console.error('Error loading alerts:', err);
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  const fetchJobData = async () => {
    try {
      const response = await adminApi.getJobManagementData();
      if (response.success) {
        setJobData(response.data);
      }
    } catch (err) {
      console.error('Error loading job data:', err);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const response = await adminApi.getCompanyManagementData();
      if (response.success) {
        setCompanyData(response.data);
      }
    } catch (err) {
      console.error('Error loading company data:', err);
    }
  };

  // User action handlers
  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      
      const newStatus = currentStatus === 'Active';
      await adminApi.updateUserStatus(userId, !newStatus);
      
      // Refresh users list
      fetchUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Erreur lors de la mise à jour du statut utilisateur');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      
      await adminApi.deleteUser(userId);
      
      // Refresh users list and stats
      fetchUsers();
      fetchDashboardStats();
      
      alert('Utilisateur supprimé avec succès');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleUserSearch = (searchTerm) => {
    const newFilters = { ...userFilters, search: searchTerm, page: 1 };
    setUserFilters(newFilters);
    fetchUsers(newFilters);
  };

  const refreshData = () => {
    fetchDashboardStats();
    if (activeTab === 'users') {
      fetchUsers();
    }
    fetchAlerts();
  };

  // useEffect hooks
  useEffect(() => {
    fetchDashboardStats();
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'jobs') {
      fetchJobData();
    } else if (activeTab === 'companies') {
      fetchCompanyData();
    }
  }, [activeTab]);

  const getStatusBadge = (status) => {
    const variants = {
      Active: 'bg-green-100 text-green-800',
      Suspended: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return <Badge className={variants[status] || variants.Pending}>{status}</Badge>;
  };

  const getRoleBadge = (role) => {
    const variants = {
      student: 'bg-blue-100 text-blue-800',
      company: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800'
    };
    
    return <Badge className={variants[role] || variants.student}>{role}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome, {user?.firstName || 'Admin'}! Monitor and manage the entire platform.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={refreshData}
                disabled={isLoadingStats}
                className="text-gray-600"
              >
                {isLoadingStats ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Actualiser
              </Button>
              <Button variant="outline" className="text-gray-600">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                <Shield className="w-4 h-4 mr-2" />
                Security Center
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-700"
              >
                ×
              </Button>
            </div>
          </div>
        )}
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: TrendingUp },
              { id: 'users', name: 'User Management', icon: Users },
              { id: 'jobs', name: 'Job Management', icon: Briefcase },
              { id: 'companies', name: 'Companies', icon: Building2 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                      <p className="text-xs text-green-600 mt-1">+{stats.usersGrowth}% from last month</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">{stats.activeJobs}</div>
                      <p className="text-xs text-green-600 mt-1">Jobs en cours</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</div>
                      <p className="text-xs text-green-600 mt-1">Entreprises inscrites</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">System Health</CardTitle>
                  <div className={`h-2 w-2 rounded-full ${
                    stats.systemHealth >= 95 ? 'bg-green-500' : 
                    stats.systemHealth >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className={`text-2xl font-bold ${
                        stats.systemHealth >= 95 ? 'text-green-600' : 
                        stats.systemHealth >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {stats.systemHealth}%
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {stats.systemHealth >= 95 ? 'All systems operational' : 'System issues detected'}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">Platform Analytics</CardTitle>
                    {isLoadingStats && (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Students</span>
                        <span className="font-medium">{stats.totalStudents.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Companies</span>
                        <span className="font-medium">{stats.totalCompanies.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Jobs</span>
                        <span className="font-medium">{stats.totalJobs.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Applications</span>
                        <span className="font-medium">{stats.totalApplications.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pending Reviews</span>
                        <span className={`font-medium ${
                          stats.pendingReviews > 50 ? 'text-red-600' :
                          stats.pendingReviews > 20 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {stats.pendingReviews.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Recent Users (30d)</span>
                        <span className="font-medium text-blue-600">{stats.recentUsers.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">System Alerts</CardTitle>
                    {isLoadingAlerts && (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {alerts.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-500">No system alerts</p>
                      <p className="text-xs text-gray-400 mt-1">All systems running smoothly</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {alerts.map((alert) => {
                        const alertStyles = {
                          warning: 'bg-yellow-50 text-yellow-600 text-yellow-800',
                          info: 'bg-blue-50 text-blue-600 text-blue-800',
                          success: 'bg-green-50 text-green-600 text-green-800',
                          error: 'bg-red-50 text-red-600 text-red-800'
                        };
                        const [bgColor, iconColor, textColor] = alertStyles[alert.type]?.split(' ') || alertStyles.info.split(' ');
                        
                        return (
                          <div key={alert.id} className={`flex items-start gap-3 p-3 ${bgColor} rounded-lg`}>
                            <AlertCircle className={`w-4 h-4 ${iconColor} mt-0.5`} />
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${textColor}`}>{alert.title}</p>
                              <p className={`text-xs ${iconColor}`}>{alert.message}</p>
                              {alert.timestamp && (
                                <p className={`text-xs ${iconColor} mt-1`}>
                                  {new Date(alert.timestamp).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">User Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      className="pl-9 w-64"
                      value={userFilters.search}
                      onChange={(e) => handleUserSearch(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {isLoadingUsers ? (
                  <div className="flex justify-center py-8">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      <span className="text-gray-500">Loading users...</span>
                    </div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No users found</p>
                    {userFilters.search && (
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your search criteria
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-3 text-sm font-medium text-gray-600">User</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Role</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Join Date</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user.id} className={index !== users.length - 1 ? 'border-b' : ''}>
                            <td className="py-4">
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                {user.details?.telephone && (
                                  <div className="text-xs text-gray-400">{user.details.telephone}</div>
                                )}
                              </div>
                            </td>
                            <td className="py-4">{getRoleBadge(user.role)}</td>
                            <td className="py-4">{getStatusBadge(user.status)}</td>
                            <td className="py-4 text-sm text-gray-600">
                              {new Date(user.joinDate).toLocaleDateString()}
                            </td>
                            <td className="py-4">
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleUserStatusToggle(user.id, user.status)}
                                  disabled={actionLoading[user.id]}
                                  className={user.status === 'Active' ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}
                                  title={user.status === 'Active' ? 'Suspend user' : 'Activate user'}
                                >
                                  {actionLoading[user.id] ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : user.status === 'Active' ? (
                                    <UserX className="w-4 h-4" />
                                  ) : (
                                    <UserCheck className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={actionLoading[user.id]}
                                  className="text-red-600 hover:text-red-700"
                                  title="Delete user"
                                >
                                  {actionLoading[user.id] ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <UserX className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Pagination */}
                    {userPagination.totalPages > 1 && (
                      <div className="flex justify-between items-center mt-6 pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          Showing {((userPagination.page - 1) * userPagination.limit) + 1} to {Math.min(userPagination.page * userPagination.limit, userPagination.total)} of {userPagination.total} users
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={userPagination.page <= 1}
                            onClick={() => {
                              const newFilters = { ...userFilters, page: userPagination.page - 1 };
                              setUserFilters(newFilters);
                              fetchUsers(newFilters);
                            }}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={userPagination.page >= userPagination.totalPages}
                            onClick={() => {
                              const newFilters = { ...userFilters, page: userPagination.page + 1 };
                              setUserFilters(newFilters);
                              fetchUsers(newFilters);
                            }}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Job Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  {!jobData ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {Object.values(jobData.jobStats || {}).reduce((a, b) => a + b, 0)}
                      </div>
                      <p className="text-xs text-blue-600 mt-1">All job postings</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Published Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  {!jobData ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {jobData.jobStats?.publiee || 0}
                      </div>
                      <p className="text-xs text-green-600 mt-1">Active postings</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Draft Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  {!jobData ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {jobData.jobStats?.brouillon || 0}
                      </div>
                      <p className="text-xs text-yellow-600 mt-1">Pending publication</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Applications</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  {!jobData ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {Object.values(jobData.applicationStats || {}).reduce((a, b) => a + b, 0)}
                      </div>
                      <p className="text-xs text-purple-600 mt-1">Total applications</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Jobs Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">Recent Job Postings</CardTitle>
                  {!jobData && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!jobData ? (
                  <div className="flex justify-center py-8">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      <span className="text-gray-500">Loading jobs...</span>
                    </div>
                  </div>
                ) : jobData.recentJobs?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No jobs found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-3 text-sm font-medium text-gray-600">Job Title</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Company</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Type</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Location</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Posted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobData.recentJobs.map((job, index) => (
                          <tr key={job.id} className={index !== jobData.recentJobs.length - 1 ? 'border-b' : ''}>
                            <td className="py-4">
                              <div>
                                <div className="font-medium text-gray-900">{job.titre}</div>
                                <div className="text-sm text-gray-500">{job.nombrePostes} position(s)</div>
                              </div>
                            </td>
                            <td className="py-4 text-sm text-gray-600">{job.raisonSociale || 'N/A'}</td>
                            <td className="py-4">
                              <Badge className={job.typeOffre === 'stage' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                                {job.typeOffre === 'stage' ? 'Stage' : 'Emploi'}
                              </Badge>
                            </td>
                            <td className="py-4">
                              <Badge className={
                                job.statut === 'publiee' ? 'bg-green-100 text-green-800' :
                                job.statut === 'brouillon' ? 'bg-yellow-100 text-yellow-800' :
                                job.statut === 'expiree' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {job.statut === 'publiee' ? 'Published' :
                                 job.statut === 'brouillon' ? 'Draft' :
                                 job.statut === 'expiree' ? 'Expired' : job.statut}
                              </Badge>
                            </td>
                            <td className="py-4 text-sm text-gray-600">{job.localisation || 'Remote'}</td>
                            <td className="py-4 text-sm text-gray-600">
                              {job.datePublication ? new Date(job.datePublication).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Statistics */}
            {jobData?.applicationStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Application Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(jobData.applicationStats).map(([status, count]) => (
                      <div key={status} className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{count}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {status === 'soumise' ? 'Submitted' :
                           status === 'en_cours' ? 'In Review' :
                           status === 'acceptee' ? 'Accepted' :
                           status === 'refusee' ? 'Rejected' : status}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="space-y-6">
            {/* Company Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  {!companyData ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {companyData.companies?.length || 0}
                      </div>
                      <p className="text-xs text-blue-600 mt-1">Registered companies</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  {!companyData ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {companyData.companies?.filter(c => c.isActive).length || 0}
                      </div>
                      <p className="text-xs text-green-600 mt-1">Active accounts</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Partners</CardTitle>
                  <Shield className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  {!companyData ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {companyData.totalPartners || 0}
                      </div>
                      <p className="text-xs text-purple-600 mt-1">Verified partners</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Sectors</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  {!companyData ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {Object.keys(companyData.sectorStats || {}).length}
                      </div>
                      <p className="text-xs text-orange-600 mt-1">Industry sectors</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Companies Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">Recent Companies</CardTitle>
                  {!companyData && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!companyData ? (
                  <div className="flex justify-center py-8">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      <span className="text-gray-500">Loading companies...</span>
                    </div>
                  </div>
                ) : companyData.companies?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No companies found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-3 text-sm font-medium text-gray-600">Company</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Sector</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Jobs Posted</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Joined</th>
                          <th className="pb-3 text-sm font-medium text-gray-600">Partner</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyData.companies.slice(0, 20).map((company, index) => (
                          <tr key={company.id} className={index !== Math.min(companyData.companies.length, 20) - 1 ? 'border-b' : ''}>
                            <td className="py-4">
                              <div>
                                <div className="font-medium text-gray-900">{company.raisonSociale}</div>
                                <div className="text-sm text-gray-500">{company.email}</div>
                                {company.siteWeb && (
                                  <div className="text-xs text-blue-600">
                                    <a href={company.siteWeb} target="_blank" rel="noopener noreferrer">
                                      {company.siteWeb}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 text-sm text-gray-600">
                              {company.secteurActivite || 'Non spécifié'}
                            </td>
                            <td className="py-4">
                              <Badge className={company.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {company.isActive ? 'Active' : 'Suspended'}
                              </Badge>
                            </td>
                            <td className="py-4 text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                {company.jobCount || 0}
                              </div>
                            </td>
                            <td className="py-4 text-sm text-gray-600">
                              {company.dateInscription ? new Date(company.dateInscription).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-4">
                              {company.isPartenaire ? (
                                <Badge className="bg-purple-100 text-purple-800">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Partner
                                </Badge>
                              ) : (
                                <span className="text-gray-400 text-sm">Regular</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sector Statistics */}
            {companyData?.sectorStats && Object.keys(companyData.sectorStats).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Industry Sectors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(companyData.sectorStats)
                      .sort(([,a], [,b]) => b - a)
                      .map(([sector, count]) => (
                        <div key={sector} className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{count}</div>
                          <div className="text-sm text-gray-500">{sector}</div>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;