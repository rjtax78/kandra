import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star, 
  Eye, 
  Calendar, 
  Mail, 
  Download, 
  Archive,
  Tag,
  MessageCircle
} from 'lucide-react';
import { Button } from '../ui/button';

const BulkActionsBar = ({ selectedCount, onBulkAction, selectedApplications, onClose }) => {
  const [showActionDropdown, setShowActionDropdown] = useState(false);

  const bulkActions = [
    {
      id: 'en_cours',
      label: 'Marquer en Cours',
      icon: Eye,
      color: 'text-yellow-600',
      description: 'Mettre les candidatures sélectionnées en cours d\'examen'
    },
    {
      id: 'acceptee',
      label: 'Accepter',
      icon: CheckCircle,
      color: 'text-green-600',
      description: 'Accepter les candidatures sélectionnées'
    },
    {
      id: 'refusee',
      label: 'Refuser',
      icon: XCircle,
      color: 'text-red-600',
      description: 'Refuser les candidatures sélectionnées'
    },
    {
      id: 'annulee',
      label: 'Annuler',
      icon: Clock,
      color: 'text-gray-600',
      description: 'Annuler les candidatures sélectionnées'
    }
  ];

  const communicationActions = [
    {
      id: 'send_email',
      label: 'Send Email',
      icon: Mail,
      color: 'text-blue-600',
      description: 'Send bulk email to candidates'
    },
    {
      id: 'send_message',
      label: 'Send Message',
      icon: MessageCircle,
      color: 'text-green-600',
      description: 'Send personalized messages'
    }
  ];

  const otherActions = [
    {
      id: 'export',
      label: 'Export Data',
      icon: Download,
      color: 'text-indigo-600',
      description: 'Export selected applications data'
    },
    {
      id: 'add_tag',
      label: 'Add Tag',
      icon: Tag,
      color: 'text-pink-600',
      description: 'Add tags to selected applications'
    }
  ];

  const handleAction = (actionId) => {
    onBulkAction(actionId, selectedApplications);
    setShowActionDropdown(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white shadow-lg border-t border-blue-700 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-200" />
              <span className="font-medium">
                {selectedCount} application{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Actions */}
            <div className="hidden md:flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-blue-400 text-white hover:bg-blue-500"
                onClick={() => handleAction('en_cours')}
              >
                <Eye className="h-4 w-4 mr-1" />
                En Cours
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-blue-400 text-white hover:bg-blue-500"
                onClick={() => handleAction('acceptee')}
              >
                <Star className="h-4 w-4 mr-1" />
                Accepter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-red-400 text-white hover:bg-red-500"
                onClick={() => handleAction('refusee')}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Refuser
              </Button>
            </div>

            {/* More Actions Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-blue-400 text-white hover:bg-blue-500"
                onClick={() => setShowActionDropdown(!showActionDropdown)}
              >
                More Actions
              </Button>
              
              {showActionDropdown && (
                <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 text-gray-900 z-50">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Bulk Actions</h3>
                    
                    {/* Status Actions */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Change Status</h4>
                      <div className="space-y-1">
                        {bulkActions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={action.id}
                              onClick={() => handleAction(action.id)}
                              className={`w-full flex items-start px-3 py-2 text-sm rounded-md hover:bg-gray-50 ${action.color}`}
                            >
                              <Icon className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                              <div className="text-left">
                                <div className="font-medium">{action.label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{action.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Communication Actions */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Communication</h4>
                      <div className="space-y-1">
                        {communicationActions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={action.id}
                              onClick={() => handleAction(action.id)}
                              className={`w-full flex items-start px-3 py-2 text-sm rounded-md hover:bg-gray-50 ${action.color}`}
                            >
                              <Icon className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                              <div className="text-left">
                                <div className="font-medium">{action.label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{action.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Other Actions */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="space-y-1">
                        {otherActions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={action.id}
                              onClick={() => handleAction(action.id)}
                              className={`w-full flex items-start px-3 py-2 text-sm rounded-md hover:bg-gray-50 ${action.color}`}
                            >
                              <Icon className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                              <div className="text-left">
                                <div className="font-medium">{action.label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{action.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 hover:bg-blue-700 rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;