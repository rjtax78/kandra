import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Video, 
  Phone, 
  Mail, 
  Plus, 
  X, 
  Send,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const InterviewScheduler = ({ 
  candidate, 
  isOpen, 
  onClose, 
  onSchedule, 
  existingInterview = null 
}) => {
  const [interviewData, setInterviewData] = useState({
    type: 'video', // video, phone, in-person
    date: '',
    time: '',
    duration: 60,
    location: '',
    meetingLink: '',
    interviewers: [{ name: '', email: '', role: '' }],
    agenda: '',
    notes: '',
    reminder: true,
    reminderTime: 24 // hours before
  });

  const [emailTemplate, setEmailTemplate] = useState('');
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(!existingInterview);

  useEffect(() => {
    if (existingInterview) {
      setInterviewData({
        ...existingInterview,
        date: existingInterview.scheduledDate?.split('T')[0] || '',
        time: existingInterview.scheduledDate ? 
          new Date(existingInterview.scheduledDate).toTimeString().slice(0, 5) : '',
        interviewers: existingInterview.interviewers || [{ name: '', email: '', role: '' }]
      });
      setIsEditing(false);
    }
  }, [existingInterview]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setInterviewData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterviewerChange = (index, field, value) => {
    const newInterviewers = [...interviewData.interviewers];
    newInterviewers[index][field] = value;
    setInterviewData(prev => ({ ...prev, interviewers: newInterviewers }));
  };

  const addInterviewer = () => {
    setInterviewData(prev => ({
      ...prev,
      interviewers: [...prev.interviewers, { name: '', email: '', role: '' }]
    }));
  };

  const removeInterviewer = (index) => {
    if (interviewData.interviewers.length > 1) {
      const newInterviewers = interviewData.interviewers.filter((_, i) => i !== index);
      setInterviewData(prev => ({ ...prev, interviewers: newInterviewers }));
    }
  };

  const generateEmailTemplate = () => {
    const scheduledDateTime = new Date(`${interviewData.date}T${interviewData.time}`);
    const formattedDate = scheduledDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = scheduledDateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const template = `
Subject: Interview Invitation - [Position Title]

Dear ${candidate.candidateName},

We are pleased to invite you for an interview for the position you applied for.

Interview Details:
• Date: ${formattedDate}
• Time: ${formattedTime}
• Duration: ${interviewData.duration} minutes
• Type: ${interviewData.type === 'video' ? 'Video Call' : interviewData.type === 'phone' ? 'Phone Call' : 'In-Person'}
${interviewData.type === 'video' && interviewData.meetingLink ? `• Meeting Link: ${interviewData.meetingLink}` : ''}
${interviewData.type === 'in-person' && interviewData.location ? `• Location: ${interviewData.location}` : ''}

Interviewers:
${interviewData.interviewers.map(interviewer => 
  `• ${interviewer.name} (${interviewer.role})`
).join('\n')}

${interviewData.agenda ? `
Agenda:
${interviewData.agenda}
` : ''}

Please confirm your availability by replying to this email.

Best regards,
HR Team
    `.trim();

    setEmailTemplate(template);
    setShowEmailPreview(true);
  };

  const handleSchedule = () => {
    const scheduledDateTime = new Date(`${interviewData.date}T${interviewData.time}`);
    
    const scheduleData = {
      ...interviewData,
      candidateId: candidate.candidateId,
      applicationId: candidate.id,
      scheduledDate: scheduledDateTime.toISOString(),
      status: 'scheduled'
    };

    onSchedule(scheduleData);
    onClose();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'in-person': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-3xl">
          <div className="flex h-full flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {existingInterview ? 'Interview Details' : 'Schedule Interview'}
                  </h2>
                  <p className="text-indigo-200">
                    {candidate.candidateName} • {candidate.position}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-md p-2 text-white hover:bg-white hover:bg-opacity-20"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {showEmailPreview ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Email Preview</h3>
                    <Button
                      variant="outline"
                      onClick={() => setShowEmailPreview(false)}
                    >
                      Back to Form
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                      {emailTemplate}
                    </pre>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button onClick={handleSchedule} className="bg-green-600 hover:bg-green-700">
                      <Send className="h-4 w-4 mr-2" />
                      Send & Schedule
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleSchedule();
                        setShowEmailPreview(false);
                      }}
                    >
                      Schedule Without Sending
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {existingInterview && !isEditing && (
                    <div className="flex items-center justify-between">
                      <Badge className={`${getTypeColor(interviewData.type)} flex items-center gap-2`}>
                        {getTypeIcon(interviewData.type)}
                        {interviewData.type.charAt(0).toUpperCase() + interviewData.type.slice(1)} Interview
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  )}

                  {/* Interview Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'video', label: 'Video Call', icon: Video },
                        { value: 'phone', label: 'Phone Call', icon: Phone },
                        { value: 'in-person', label: 'In Person', icon: MapPin }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          disabled={!isEditing}
                          onClick={() => handleInputChange('type', value)}
                          className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                            interviewData.type === value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        disabled={!isEditing}
                        value={interviewData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        disabled={!isEditing}
                        value={interviewData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <select
                        disabled={!isEditing}
                        value={interviewData.duration}
                        onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      >
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>
                  </div>

                  {/* Location/Meeting Link */}
                  {interviewData.type === 'video' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meeting Link
                      </label>
                      <input
                        type="url"
                        disabled={!isEditing}
                        value={interviewData.meetingLink}
                        onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                        placeholder="https://zoom.us/j/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      />
                    </div>
                  )}

                  {interviewData.type === 'in-person' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={interviewData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Office address or meeting room"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      />
                    </div>
                  )}

                  {/* Interviewers */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700">
                        Interviewers
                      </label>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addInterviewer}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {interviewData.interviewers.map((interviewer, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-lg">
                          <input
                            type="text"
                            disabled={!isEditing}
                            placeholder="Name"
                            value={interviewer.name}
                            onChange={(e) => handleInterviewerChange(index, 'name', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                          />
                          <input
                            type="email"
                            disabled={!isEditing}
                            placeholder="Email"
                            value={interviewer.email}
                            onChange={(e) => handleInterviewerChange(index, 'email', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                          />
                          <input
                            type="text"
                            disabled={!isEditing}
                            placeholder="Role"
                            value={interviewer.role}
                            onChange={(e) => handleInterviewerChange(index, 'role', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                          />
                          {isEditing && interviewData.interviewers.length > 1 && (
                            <button
                              onClick={() => removeInterviewer(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Agenda */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agenda
                    </label>
                    <textarea
                      disabled={!isEditing}
                      value={interviewData.agenda}
                      onChange={(e) => handleInputChange('agenda', e.target.value)}
                      rows={4}
                      placeholder="Interview agenda or topics to cover..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internal Notes
                    </label>
                    <textarea
                      disabled={!isEditing}
                      value={interviewData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      placeholder="Internal notes (not shared with candidate)..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>

                  {/* Reminder Settings */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-gray-700">
                        Email Reminder
                      </label>
                      <input
                        type="checkbox"
                        disabled={!isEditing}
                        checked={interviewData.reminder}
                        onChange={(e) => handleInputChange('reminder', e.target.checked)}
                        className="disabled:opacity-50"
                      />
                    </div>
                    {interviewData.reminder && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Send reminder
                        </label>
                        <select
                          disabled={!isEditing}
                          value={interviewData.reminderTime}
                          onChange={(e) => handleInputChange('reminderTime', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        >
                          <option value={1}>1 hour before</option>
                          <option value={24}>24 hours before</option>
                          <option value={48}>48 hours before</option>
                          <option value={168}>1 week before</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {isEditing && (
              <div className="bg-gray-50 px-6 py-4 border-t flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (existingInterview) {
                      setIsEditing(false);
                    } else {
                      onClose();
                    }
                  }}
                >
                  {existingInterview ? 'Cancel' : 'Close'}
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={generateEmailTemplate}
                    disabled={!interviewData.date || !interviewData.time}
                  >
                    Preview Email
                  </Button>
                  <Button
                    onClick={handleSchedule}
                    disabled={!interviewData.date || !interviewData.time}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {existingInterview ? 'Update Interview' : 'Schedule Interview'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduler;