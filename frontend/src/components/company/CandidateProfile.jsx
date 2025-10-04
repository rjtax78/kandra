import React, { useState, useEffect } from 'react';
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

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !candidate) return null;

  // Safety check and data formatting
  const safeCandidate = {
    ...candidate,
    rating: typeof candidate.rating === 'number' ? candidate.rating : 0,
    skills: Array.isArray(candidate.skills) ? candidate.skills : [],
    candidateName: candidate.candidateName || candidate.name || 'Candidat',
    candidateEmail: candidate.candidateEmail || candidate.email || 'N/A',
    candidatePhone: candidate.candidatePhone || candidate.phone || 'N/A',
    candidateLocation: candidate.candidateLocation || candidate.location || 'N/A'
  };

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
      case 'soumise':
        actions.push(
          { id: 'en_cours', label: 'Marquer en Cours', icon: Eye, color: 'text-yellow-600' },
          { id: 'refusee', label: 'Refuser', icon: XCircle, color: 'text-red-600' }
        );
        break;
      case 'en_cours':
        actions.push(
          { id: 'acceptee', label: 'Accepter', icon: CheckCircle, color: 'text-green-600' },
          { id: 'refusee', label: 'Refuser', icon: XCircle, color: 'text-red-600' }
        );
        break;
      case 'acceptee':
        actions.push(
          { id: 'annulee', label: 'Annuler', icon: Clock, color: 'text-gray-600' }
        );
        break;
      case 'refusee':
        actions.push(
          { id: 'en_cours', label: 'Remettre en Cours', icon: Eye, color: 'text-yellow-600' }
        );
        break;
      // Legacy statuses for backward compatibility
      case 'applied':
        actions.push(
          { id: 'en_cours', label: 'Mark Under Review', icon: Eye, color: 'text-yellow-600' },
          { id: 'refusee', label: 'Reject', icon: XCircle, color: 'text-red-600' }
        );
        break;
      default:
        actions.push(
          { id: 'en_cours', label: 'Marquer en Cours', icon: Eye, color: 'text-yellow-600' },
          { id: 'acceptee', label: 'Accepter', icon: CheckCircle, color: 'text-green-600' },
          { id: 'refusee', label: 'Refuser', icon: XCircle, color: 'text-red-600' }
        );
        break;
    }
    
    return actions;
  };

  const statusActions = getStatusActions(safeCandidate.status);

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
            <div className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-50 to-transparent rounded-full -ml-12 -mb-12"></div>
              <div className="relative">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3 shadow-md">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{safeCandidate.candidateEmail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{safeCandidate.candidatePhone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{safeCandidate.candidateLocation}</p>
                  </div>
                </div>
                {safeCandidate.portfolio && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Portfolio</p>
                      <a 
                        href={safeCandidate.portfolio}
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
            </div>

            {/* Experience & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg mr-3">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                </div>
                <p className="text-3xl font-bold text-blue-700">{safeCandidate.experience || 'N/A'}</p>
                <p className="text-sm text-blue-600 mt-1 font-medium">Years of experience</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-500 rounded-lg mr-3">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                </div>
                <p className="text-lg font-semibold text-green-700 leading-relaxed">
                  {typeof safeCandidate.education === 'object' && safeCandidate.education ? 
                    `${safeCandidate.education.niveau || 'N/A'} en ${safeCandidate.education.filiere || 'N/A'}` :
                    safeCandidate.education || 
                    (safeCandidate.candidateDetails && `${safeCandidate.candidateDetails.niveau || 'N/A'} en ${safeCandidate.candidateDetails.filiere || 'N/A'}`) || 
                    'Non renseigné'
                  }
                </p>
                <p className="text-sm text-green-600 mt-2 font-medium">Academic background</p>
              </div>
            </div>

            {/* Skills */}
            <div className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100 overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-50 to-transparent rounded-full -ml-20 -mt-20"></div>
              <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-pink-50 to-transparent rounded-full -mr-14 -mb-14"></div>
              <div className="relative">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mr-3 shadow-md">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  Skills & Competencies
                </h3>
              <div className="flex flex-wrap gap-3">
                {safeCandidate.skills && safeCandidate.skills.length > 0 ? (
                  safeCandidate.skills.map((skill, index) => (
                    <Badge key={index} className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-4 py-2 text-sm font-medium border border-purple-200 shadow-sm">
                      {typeof skill === 'string' ? skill : skill.nom}
                    </Badge>
                  ))
                ) : (
                  <div className="text-center py-8 w-full">
                    <Award className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Aucune compétence renseignée</p>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            {safeCandidate.coverLetter && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  Cover Letter
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                  <p className="text-gray-700 leading-relaxed text-sm">{safeCandidate.coverLetter}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'resume':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-6">
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Resume Preview</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {safeCandidate.resumeUrl ? 'Click below to download the candidate\'s resume document' : 'No resume has been uploaded by this candidate'}
                </p>
                {safeCandidate.resumeUrl ? (
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 max-w-xs mx-auto">
                    <p className="text-sm text-gray-500">Resume not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mb-6">
                  <Globe className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Portfolio</h3>
                {safeCandidate.portfolio ? (
                  <div>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">View the candidate's online portfolio and work samples</p>
                    <Button 
                      onClick={() => window.open(safeCandidate.portfolio, '_blank')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Portfolio
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">This candidate has not provided a portfolio link</p>
                    <div className="bg-gray-50 rounded-lg p-4 max-w-xs mx-auto">
                      <p className="text-sm text-gray-500">No portfolio available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'assessment':
        return (
          <div className="space-y-6">
            {/* Rating */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-yellow-500 rounded-lg mr-3">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    Overall Rating
                  </h3>
                  <div className="flex items-center">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-7 w-7 ${
                            star <= (safeCandidate.rating || 0)
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-4 text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      {safeCandidate.rating ? safeCandidate.rating.toFixed(1) : '0'}/5
                    </span>
                  </div>
                </div>
                <div className="text-right bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-600 font-medium">Rating based on</p>
                  <p className="font-semibold text-yellow-700">Profile & Application</p>
                </div>
              </div>
            </div>

            {/* Assessment Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg mr-3">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Skills Match</h4>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 bg-blue-100 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm" style={{width: '85%'}}></div>
                  </div>
                  <span className="ml-3 text-lg font-bold text-blue-700">85%</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-500 rounded-lg mr-3">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Experience Level</h4>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 bg-green-100 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm" style={{width: '90%'}}></div>
                  </div>
                  <span className="ml-3 text-lg font-bold text-green-700">90%</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-500 rounded-lg mr-3">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Communication</h4>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 bg-purple-100 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full shadow-sm" style={{width: '75%'}}></div>
                  </div>
                  <span className="ml-3 text-lg font-bold text-purple-700">75%</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-orange-500 rounded-lg mr-3">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Cultural Fit</h4>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 bg-orange-100 rounded-full h-3">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full shadow-sm" style={{width: '80%'}}></div>
                  </div>
                  <span className="ml-3 text-lg font-bold text-orange-700">80%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <div className="p-2 bg-blue-500 rounded-lg mr-3">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  Internal Notes
                </h3>
                <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors">
                  Add Note
                </Button>
              </div>
              
              {safeCandidate.notes ? (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-gray-900">HR Team</span>
                        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {formatDate(safeCandidate.lastActivity)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{safeCandidate.notes}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No notes added yet</p>
                  <p className="text-gray-500 text-sm mt-1">Add internal notes to track candidate progress</p>
                </div>
              )}
            </div>

            {/* Add Note Form */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="h-5 w-5 text-gray-600 mr-2" />
                Add a Note
              </h4>
              <textarea
                placeholder="Enter your notes about this candidate..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              />
              <div className="mt-4 flex justify-end">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Overlay with Close Option */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/20 via-gray-900/30 to-black/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>
      
      {/* Modal Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-4 sm:pl-6 lg:pl-8">
        <div className="w-screen max-w-5xl">
          <div className="flex h-full flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 shadow-2xl border-l border-gray-200 relative">
            {/* Decorative overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-transparent to-purple-50/20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-100/40 to-transparent rounded-full -translate-x-48 -translate-y-48 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full translate-x-40 translate-y-40 pointer-events-none"></div>
            
            {/* Main content with relative positioning */}
            <div className="relative flex h-full flex-col z-10">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-8 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-20"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white bg-opacity-5 rounded-full -ml-20 -mb-20"></div>
                <div className="absolute top-2 left-2 w-32 h-32 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-tl from-pink-200/15 to-purple-200/15 rounded-full"></div>
                
                <div className="relative flex items-start justify-between">
                  <div className="flex items-start space-x-6">
                    {safeCandidate.candidatePhoto || safeCandidate.photo ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-blue-200/30 rounded-2xl"></div>
                        <img
                          src={safeCandidate.candidatePhoto || safeCandidate.photo}
                          alt={safeCandidate.candidateName}
                          className="relative w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-blue-200/30 rounded-2xl"></div>
                        <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-white to-gray-100 border-4 border-white shadow-xl flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-600">
                            {safeCandidate.candidateName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}
                    <div className="text-white space-y-2">
                      <div>
                        <h2 className="text-3xl font-bold text-white drop-shadow-lg">{safeCandidate.candidateName}</h2>
                        <p className="text-white text-opacity-90 text-lg font-medium drop-shadow-sm">
                          {safeCandidate.position || safeCandidate.jobTitle || 'Candidat'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 bg-white bg-opacity-25 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                          <Calendar className="h-4 w-4" />
                          <span>Applied {formatDate(safeCandidate.appliedDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-white bg-opacity-25 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                          <Star className="h-4 w-4 text-yellow-300 fill-current" />
                          <span className="font-semibold">{safeCandidate.rating ? safeCandidate.rating.toFixed(1) : 'N/A'}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="inline-flex">{getStatusBadge(safeCandidate.status)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced close button with tooltip */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={onClose}
                      className="relative rounded-xl p-3 text-white hover:bg-white hover:bg-opacity-25 transition-all duration-200 group backdrop-blur-sm shadow-lg"
                      title="Close Profile"
                    >
                      <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
                    </button>
                    
                    {/* Additional quick close option */}
                    <button
                      onClick={onClose}
                      className="text-xs text-white text-opacity-70 hover:text-opacity-100 transition-opacity duration-200 px-2"
                    >
                      ESC
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="border-b border-gray-200 px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors">
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
                                    onStatusUpdate(safeCandidate.id, action.id);
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
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    Schedule Interview
                  </Button>
                </div>
              </div>
            </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 px-8 bg-white shadow-sm">
              <nav className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-3 font-semibold text-sm flex items-center transition-all duration-200 relative ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-blue-50 bg-opacity-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`h-4 w-4 mr-2 transition-colors ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;