import React, { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Loader2, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';

const JobApplicationModal = ({ 
  job, 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting = false, 
  error = null 
}) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    motivation: '',
    portfolioUrl: '',
    linkedinUrl: '',
    additionalNotes: ''
  });

  const [files, setFiles] = useState({
    resume: null,
    coverLetterFile: null,
    portfolio: null
  });

  if (!isOpen || !job) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const applicationData = {
      ...formData,
      ...files,
      jobId: job.id,
      appliedAt: new Date().toISOString()
    };
    
    onSubmit(applicationData);
  };

  const resetForm = () => {
    setFormData({
      coverLetter: '',
      motivation: '',
      portfolioUrl: '',
      linkedinUrl: '',
      additionalNotes: ''
    });
    setFiles({
      resume: null,
      coverLetterFile: null,
      portfolio: null
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden backdrop-blur-sm bg-white/10">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-4">
        <div className="w-screen max-w-3xl">
          <div className="flex h-full flex-col bg-white shadow-2xl border border-gray-200 rounded-l-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 px-8 py-6 rounded-tl-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {job.company?.charAt(0) || 'J'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <p className="text-sm text-gray-500">Application in progress</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                    <p className="text-gray-600 text-sm">{job.company}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-xl p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50/30">
              {error && (
                <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-400 rounded-r-xl flex items-start shadow-sm">
                  <div className="bg-red-100 p-2 rounded-full mr-4">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-red-800 font-semibold">Application Error</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Job Summary */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">Job Summary</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-500 font-medium mb-1">Position</p>
                          <p className="text-gray-900 font-semibold">{job.title}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium mb-1">Company</p>
                          <p className="text-gray-900 font-semibold">{job.company}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-500 font-medium mb-1">Type</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              job.typeOffre === 'emploi' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {job.typeOffre === 'emploi' ? 'Full-time' : 'Internship'}
                            </span>
                          </div>
                        </div>
                        {job.location && (
                          <div>
                            <p className="text-gray-500 font-medium mb-1">Location</p>
                            <p className="text-gray-900 font-semibold">{job.location}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Upload className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-900">
                          Resume / CV *
                        </label>
                        <p className="text-sm text-gray-500">Upload your latest resume (PDF, DOC, DOCX)</p>
                      </div>
                    </div>
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      files.resume 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
                    }`}>
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange('resume', e.target.files[0])}
                        className="hidden"
                        required
                      />
                      <label htmlFor="resume" className="cursor-pointer">
                        {files.resume ? (
                          <>
                            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                            <p className="text-lg font-semibold text-green-800 mb-1">File Selected!</p>
                            <p className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block">
                              📄 {files.resume.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                              <Upload className="h-8 w-8 text-blue-600" />
                            </div>
                            <p className="text-lg font-semibold text-gray-700 mb-2">Upload your resume</p>
                            <p className="text-sm text-gray-500 mb-4">PDF, DOC, or DOCX format</p>
                            <div className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-block font-medium hover:bg-blue-700 transition-colors">
                              Choose File
                            </div>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-900">
                          Cover Letter *
                        </label>
                        <p className="text-sm text-gray-500">Tell us why you're the perfect fit</p>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea
                        value={formData.coverLetter}
                        onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                        rows={8}
                        required
                        placeholder="Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. 

With my background in [your field], I am confident that I would be a valuable addition to your team. Here's why:

• [Your key qualification 1]
• [Your key qualification 2] 
• [Your key qualification 3]

I am excited about the opportunity to contribute to [specific company goal/project] and would welcome the chance to discuss how my skills align with your needs.

Thank you for your consideration.

Best regards,
[Your Name]"
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors resize-none"
                      />
                      <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                        {formData.coverLetter.length}/2000 characters
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information - Optional */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-900">
                          Additional Information
                        </label>
                        <p className="text-sm text-gray-500">Optional but helpful details</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Portfolio URL */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          🔗 Portfolio URL
                        </label>
                        <Input
                          type="url"
                          value={formData.portfolioUrl}
                          onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                          placeholder="https://your-portfolio.com"
                          className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* LinkedIn URL */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          💼 LinkedIn Profile
                        </label>
                        <Input
                          type="url"
                          value={formData.linkedinUrl}
                          onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                          placeholder="https://linkedin.com/in/your-profile"
                          className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Why this position */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          💭 Why are you interested in this position?
                        </label>
                        <textarea
                          value={formData.motivation}
                          onChange={(e) => handleInputChange('motivation', e.target.value)}
                          rows={3}
                          placeholder="What excites you about this role and company? (Optional)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 px-8 py-6 rounded-bl-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle className={`h-4 w-4 ${files.resume ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={files.resume ? 'text-green-700' : 'text-gray-500'}>Resume uploaded</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className={`h-4 w-4 ${formData.coverLetter ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={formData.coverLetter ? 'text-green-700' : 'text-gray-500'}>Cover letter written</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-6 py-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.coverLetter || !files.resume}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  📝 <strong>Pro tip:</strong> Make sure your cover letter is personalized and highlights your most relevant skills for this position.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;