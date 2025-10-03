import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Users, Briefcase, Building2, TrendingUp, Shield, Settings, Search, Filter, UserCheck, UserX, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const AdminDashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for admin dashboard
  const [users] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student',
      status: 'Active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20'
    },
    {
      id: 2,
      name: 'Tech Corp',
      email: 'hr@techcorp.com',
      role: 'company',
      status: 'Active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-19'
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'student',
      status: 'Suspended',
      joinDate: '2023-12-20',
      lastLogin: '2024-01-18'
    }
  ]);

  const stats = {
    totalUsers: 1250,
    totalStudents: 1000,
    totalCompanies: 180,
    totalJobs: 450,
    activeJobs: 320,
    totalApplications: 5600,
    pendingReviews: 45,
    systemHealth: 98.5
  };

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
                  <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.activeJobs}</div>
                  <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</div>
                  <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">System Health</CardTitle>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.systemHealth}%</div>
                  <p className="text-xs text-gray-600 mt-1">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Platform Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Students</span>
                      <span className="font-medium">{stats.totalStudents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Companies</span>
                      <span className="font-medium">{stats.totalCompanies}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Applications</span>
                      <span className="font-medium">{stats.totalApplications.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending Reviews</span>
                      <span className="font-medium text-yellow-600">{stats.pendingReviews}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">System Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800">Server Load Alert</p>
                        <p className="text-xs text-yellow-600">High traffic detected on job search</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <UserCheck className="w-4 h-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">New Company Verified</p>
                        <p className="text-xs text-green-600">TechStart Inc. has been verified</p>
                      </div>
                    </div>
                  </div>
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
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 text-sm font-medium text-gray-600">User</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">Role</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">Join Date</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">Last Login</th>
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
                          </div>
                        </td>
                        <td className="py-4">{getRoleBadge(user.role)}</td>
                        <td className="py-4">{getStatusBadge(user.status)}</td>
                        <td className="py-4 text-sm text-gray-600">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                              <UserCheck className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {(activeTab === 'jobs' || activeTab === 'companies') && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  {activeTab === 'jobs' ? (
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'jobs' ? 'Job Management' : 'Company Management'}
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'jobs' 
                    ? 'Advanced job management features coming soon...'
                    : 'Company verification and management tools coming soon...'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;