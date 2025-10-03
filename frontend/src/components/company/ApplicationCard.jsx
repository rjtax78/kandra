import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  ExternalLink, 
  Download,
  MoreHorizontal,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  User
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const ApplicationCard = ({ 
  application, 
  isSelected, 
  onSelect, 
  onStatusUpdate, 
  onViewCandidate, 
  getStatusBadge 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
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

  const statusActions = getStatusActions(application.status);

  return (
    <div className={`bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onSelect}
                className="mr-3"
              />
            </label>
            <div className="relative">
              <img
                src={application.candidatePhoto}
                alt={application.candidateName}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                }}
              />
              {application.rating >= 4.5 && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-1">
                  <Star className="h-3 w-3 fill-current" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{application.candidateName}</h3>
              <p className="text-sm text-gray-600">{application.candidateEmail}</p>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                {application.candidateLocation}
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-6 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onViewCandidate(application);
                      setShowDropdown(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status and Rating */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          {getStatusBadge(application.status)}
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium text-gray-700">{application.rating}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Applied {formatDate(application.appliedDate)}
        </div>
      </div>

      {/* Experience and Education */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2 text-gray-400" />
          <span>{application.experience}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          <span>{application.education}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {application.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1">
              {skill}
            </Badge>
          ))}
          {application.skills.length > 3 && (
            <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-1">
              +{application.skills.length - 3} more
            </Badge>
          )}
        </div>
      </div>

      {/* Interview Schedule */}
      {application.interviewScheduled && (
        <div className="px-4 py-3 bg-orange-50 border-t border-gray-200">
          <div className="flex items-center text-sm text-orange-700">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Interview: {new Date(application.interviewScheduled).toLocaleDateString()}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewCandidate(application)}
            className="flex-1 text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          {statusActions.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Actions
              </Button>
              {showDropdown && (
                <div className="absolute bottom-full right-0 mb-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    {statusActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          onClick={() => {
                            onStatusUpdate(application.id, action.id);
                            setShowDropdown(false);
                          }}
                          className={`flex items-center px-3 py-2 text-sm ${action.color} hover:bg-gray-50 w-full text-left`}
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
        </div>
      </div>

      {/* Notes */}
      {application.notes && (
        <div className="px-4 py-3 border-t border-gray-200 bg-blue-50">
          <div className="text-xs text-blue-700">
            <span className="font-medium">Note:</span> {application.notes}
          </div>
        </div>
      )}

      {/* Contact Actions (for mobile) */}
      <div className="px-4 py-3 border-t border-gray-200 flex gap-2 sm:hidden">
        <Button variant="outline" size="sm" className="flex-1">
          <Mail className="h-3 w-3 mr-1" />
          Email
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Phone className="h-3 w-3 mr-1" />
          Call
        </Button>
      </div>
    </div>
  );
};

export default ApplicationCard;