import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  GraduationCap, 
  Briefcase,
  Globe,
  FileText,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Award,
  Target,
  BookOpen
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const CandidateProfile = ({ candidate, isOpen, onClose, onStatusUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  if (!isOpen || !candidate) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const getStatusActions = (currentStatus) => {
    const actions = [];
    
    switch (currentStatus) {
      case 'applied':
        actions.push(
          { id: 'under_review', label: 'Mark Under Review', icon: Eye, color: 'text-yellow-600' },
          { id: 'rejected', label: 'Reject', icon: XCircle, color: 'text-red-600' }
        );
        break;
      case 'under_review':
        actions.push(
          { id: 'shortlisted', label: 'Shortlist', icon: Star, color: 'text-purple-600' },
          { id: 'rejected', label: 'Reject', icon: XCircle, color: 'text-red-600' }
        );
        break;
      case 'shortlisted':
        actions.push(
          { id: 'interviewed', label: 'Schedule Interview', icon: Calendar, color: 'text-orange-600' },
          { id: 'rejected', label: 'Reject', icon: XCircle, color: 'text-red-600' }
        );
        break;
      case 'interviewed':
        actions.push(
          { id: 'hired', label: 'Hire', icon: CheckCircle, color: 'text-green-600' },
          { id: 'rejected', label: 'Reject', icon: XCircle, color: 'text-red-600' },
          { id: 'on_hold', label: 'Put On Hold', icon: Clock, color: 'text-gray-600' }
        );
        break;
      default:
        break;
    }
    
    return actions;
  };

  const statusActions = getStatusActions(candidate.status);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'portfolio', label: 'Portfolio', icon: Globe },
    { id: 'assessment', label: 'Assessment', icon: Target },
    { id: 'notes', label: 'Notes', icon: BookOpen }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{candidate.candidateEmail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{candidate.candidatePhone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{candidate.candidateLocation}</p>
                  </div>
                </div>
                {candidate.portfolio && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Portfolio</p>
                      <a 
                        href={candidate.portfolio} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        View Portfolio <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Experience & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">{candidate.experience}</p>
                <p className="text-sm text-gray-600 mt-1">Years of experience</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                </div>
                <p className="text-lg font-semibold text-green-600">{candidate.education}</p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <Badge key={index} className="bg-purple-100 text-purple-800 px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cover Letter */}
            {candidate.coverLetter && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">{candidate.coverLetter}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'resume':
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Resume Preview</h3>
              <p className="text-gray-600 mb-6">
                {candidate.resumeUrl ? 'Click below to download the resume' : 'No resume uploaded'}
              </p>
              {candidate.resumeUrl && (
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
              )}
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Portfolio</h3>
              {candidate.portfolio ? (
                <div>
                  <p className="text-gray-600 mb-6">View candidate's online portfolio</p>
                  <Button 
                    onClick={() => window.open(candidate.portfolio, '_blank')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Portfolio
                  </Button>
                </div>
              ) : (
                <p className="text-gray-600">No portfolio provided</p>
              )}
            </div>
          </div>
        );

      case 'assessment':
        return (
          <div className="space-y-6">
            {/* Rating */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Rating</h3>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 ${
                            star <= candidate.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-3 text-2xl font-bold text-gray-900">
                      {candidate.rating}/5
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Rating based on</p>
                  <p className="font-semibold">Profile & Application</p>
                </div>
              </div>
            </div>

            {/* Assessment Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Award className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Skills Match</h4>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">85%</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Target className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Experience Level</h4>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">90%</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <MessageCircle className="h-5 w-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Communication</h4>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">75%</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 text-orange-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Cultural Fit</h4>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">80%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Internal Notes</h3>
              <Button variant="outline" size="sm">
                Add Note
              </Button>
            </div>
            
            {candidate.notes ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">HR Team</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(candidate.lastActivity)}
                      </span>
                    </div>
                    <p className="text-gray-700">{candidate.notes}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No notes added yet</p>
              </div>
            )}

            {/* Add Note Form */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Add a Note</h4>
              <textarea
                placeholder="Enter your notes about this candidate..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-3 flex justify-end">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Save Note
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-4xl">
          <div className="flex h-full flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={candidate.candidatePhoto}
                    alt={candidate.candidateName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                    }}
                  />
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{candidate.candidateName}</h2>
                    <p className="text-blue-100 text-lg">{candidate.position}</p>
                    <p className="text-blue-200 text-sm">
                      Applied {formatDate(candidate.appliedDate)}
                    </p>
                    <div className="mt-3 flex items-center space-x-4">
                      {getStatusBadge(candidate.status)}
                      <div className="flex items-center text-white">
                        <Star className="h-4 w-4 text-yellow-300 mr-1" />
                        <span className="font-medium">{candidate.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-md p-2 text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
                <div className="flex items-center space-x-3">
                  {statusActions.length > 0 && (
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      >
                        Update Status
                      </Button>
                      {showStatusDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            {statusActions.map((action) => {
                              const Icon = action.icon;
                              return (
                                <button
                                  key={action.id}
                                  onClick={() => {
                                    onStatusUpdate(candidate.id, action.id);
                                    setShowStatusDropdown(false);
                                  }}
                                  className={`flex items-center px-4 py-2 text-sm ${action.color} hover:bg-gray-50 w-full text-left`}
                                >
                                  <Icon className="h-4 w-4 mr-2" />
                                  {action.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Schedule Interview
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 px-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;