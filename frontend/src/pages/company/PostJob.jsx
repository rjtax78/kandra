import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  GraduationCap,
  Clock,
  FileText,
  Plus,
  X,
  Save,
  Eye,
  Upload,
  AlertCircle,
  Check
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { createCompanyJob, updateCompanyJob } from '../../store/slices/companySlice';
import { useAuth } from '../../contexts/AuthContext';

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isCreatingJob: loading, createError: error } = useSelector((state) => state.company);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    titre: '',
    typeOffre: 'emploi',
    localisation: '',
    typeContrat: 'CDI',
    salaire: '',
    nombrePostes: 1,
    
    // Job Details
    description: '',
    competencesRequises: '',
    niveauEtude: '',
    experienceRequise: '',
    
    // Company & Benefits
    avantagesSociaux: '',
    environnementTravail: '',
    opportunitesEvolution: '',
    
    // Requirements & Preferences
    languesRequises: [],
    competencesTechniques: [],
    competencesComportementales: [],
    
    // Application Settings
    dateExpiration: '',
    processusRecrutement: '',
    questionnairePersonnalise: [],
    
    // Advanced Settings
    statut: 'brouillon',
    visibilite: 'publique',
    sourcesPublication: ['site'],
    emailNotifications: true,
    requiresCoverLetter: false,
    requiresPortfolio: false
  });

  const [skills, setSkills] = useState({
    technical: '',
    behavioral: '',
    languages: ''
  });

  const [customQuestions, setCustomQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ question: '', type: 'text', required: false });

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Job title, type, location' },
    { id: 2, title: 'Details', description: 'Description, requirements' },
    { id: 3, title: 'Benefits', description: 'Compensation, perks' },
    { id: 4, title: 'Requirements', description: 'Skills, experience' },
    { id: 5, title: 'Application', description: 'Process, questions' },
    { id: 6, title: 'Settings', description: 'Visibility, notifications' }
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = (category) => {
    const skillText = skills[category].trim();
    if (skillText) {
      const skillsArray = skillText.split(',').map(s => s.trim()).filter(s => s);
      const fieldName = category === 'technical' ? 'competencesTechniques' : 
                       category === 'behavioral' ? 'competencesComportementales' : 'languesRequises';
      
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...skillsArray]
      }));
      setSkills(prev => ({ ...prev, [category]: '' }));
    }
  };

  const removeSkill = (category, index) => {
    const fieldName = category === 'technical' ? 'competencesTechniques' : 
                     category === 'behavioral' ? 'competencesComportementales' : 'languesRequises';
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const addCustomQuestion = () => {
    if (newQuestion.question.trim()) {
      const question = {
        id: Date.now(),
        ...newQuestion
      };
      setCustomQuestions(prev => [...prev, question]);
      setFormData(prev => ({
        ...prev,
        questionnairePersonnalise: [...prev.questionnairePersonnalise, question]
      }));
      setNewQuestion({ question: '', type: 'text', required: false });
    }
  };

  const removeCustomQuestion = (id) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== id));
    setFormData(prev => ({
      ...prev,
      questionnairePersonnalise: prev.questionnairePersonnalise.filter(q => q.id !== id)
    }));
  };

  const handleSubmit = async (status = 'brouillon') => {
    const jobData = {
      ...formData,
      statut: status,
      entrepriseId: user?.entreprise?.id || user?.id
    };

    try {
      await dispatch(createCompanyJob(jobData)).unwrap();
      navigate('/company/dashboard');
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => handleInputChange('titre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Senior UI/UX Designer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <select
                  value={formData.typeOffre}
                  onChange={(e) => handleInputChange('typeOffre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="emploi">Full-time Employment</option>
                  <option value="stage">Internship</option>
                  <option value="freelance">Freelance</option>
                  <option value="contrat">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.localisation}
                    onChange={(e) => handleInputChange('localisation', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Jakarta, Indonesia"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Type
                </label>
                <select
                  value={formData.typeContrat}
                  onChange={(e) => handleInputChange('typeContrat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="CDI">Permanent (CDI)</option>
                  <option value="CDD">Fixed-term (CDD)</option>
                  <option value="freelance">Freelance</option>
                  <option value="stage">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.salaire}
                    onChange={(e) => handleInputChange('salaire', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. $50,000 - $80,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Positions
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    value={formData.nombrePostes}
                    onChange={(e) => handleInputChange('nombrePostes', parseInt(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the role, responsibilities, and what makes this position exciting..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills & Qualifications
              </label>
              <textarea
                value={formData.competencesRequises}
                onChange={(e) => handleInputChange('competencesRequises', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List the key skills, qualifications, and experience required..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <select
                  value={formData.niveauEtude}
                  onChange={(e) => handleInputChange('niveauEtude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select education level</option>
                  <option value="high_school">High School</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Required
                </label>
                <select
                  value={formData.experienceRequise}
                  onChange={(e) => handleInputChange('experienceRequise', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (2-5 years)</option>
                  <option value="senior">Senior Level (5-10 years)</option>
                  <option value="lead">Lead Level (10+ years)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits & Perks
              </label>
              <textarea
                value={formData.avantagesSociaux}
                onChange={(e) => handleInputChange('avantagesSociaux', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Health insurance, flexible hours, remote work, professional development..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Environment
              </label>
              <textarea
                value={formData.environnementTravail}
                onChange={(e) => handleInputChange('environnementTravail', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the team, office culture, working style..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Growth Opportunities
              </label>
              <textarea
                value={formData.opportunitesEvolution}
                onChange={(e) => handleInputChange('opportunitesEvolution', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Career advancement, training programs, mentorship..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Technical Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Skills
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skills.technical}
                  onChange={(e) => setSkills(prev => ({ ...prev, technical: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. React, JavaScript, Node.js (comma separated)"
                />
                <Button
                  type="button"
                  onClick={() => addSkill('technical')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.competencesTechniques.map((skill, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800 px-3 py-1">
                    {skill}
                    <button
                      onClick={() => removeSkill('technical', index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Behavioral Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soft Skills
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skills.behavioral}
                  onChange={(e) => setSkills(prev => ({ ...prev, behavioral: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Leadership, Communication, Problem Solving"
                />
                <Button
                  type="button"
                  onClick={() => addSkill('behavioral')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.competencesComportementales.map((skill, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 px-3 py-1">
                    {skill}
                    <button
                      onClick={() => removeSkill('behavioral', index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skills.languages}
                  onChange={(e) => setSkills(prev => ({ ...prev, languages: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. English, French, Indonesian"
                />
                <Button
                  type="button"
                  onClick={() => addSkill('languages')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.languesRequises.map((lang, index) => (
                  <Badge key={index} className="bg-purple-100 text-purple-800 px-3 py-1">
                    {lang}
                    <button
                      onClick={() => removeSkill('languages', index)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.dateExpiration}
                  onChange={(e) => handleInputChange('dateExpiration', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recruitment Process
              </label>
              <textarea
                value={formData.processusRecrutement}
                onChange={(e) => handleInputChange('processusRecrutement', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your hiring process: screening, interviews, technical test..."
              />
            </div>

            {/* Application Requirements */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Application Requirements</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.requiresCoverLetter}
                    onChange={(e) => handleInputChange('requiresCoverLetter', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Require cover letter</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.requiresPortfolio}
                    onChange={(e) => handleInputChange('requiresPortfolio', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Require portfolio/work samples</span>
                </label>
              </div>
            </div>

            {/* Custom Questions */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Custom Application Questions</h3>
              
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your custom question"
                />
                <div className="flex gap-4 items-center">
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="select">Multiple Choice</option>
                  </select>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newQuestion.required}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, required: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Required</span>
                  </label>
                  <Button
                    type="button"
                    onClick={addCustomQuestion}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Question
                  </Button>
                </div>
              </div>

              {customQuestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700 text-sm">Custom Questions:</h4>
                  {customQuestions.map((question) => (
                    <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm text-gray-900">{question.question}</span>
                        <div className="text-xs text-gray-500">
                          Type: {question.type} • {question.required ? 'Required' : 'Optional'}
                        </div>
                      </div>
                      <button
                        onClick={() => removeCustomQuestion(question.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Status
              </label>
              <select
                value={formData.statut}
                onChange={(e) => handleInputChange('statut', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="brouillon">Draft</option>
                <option value="publiee">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <select
                value={formData.visibilite}
                onChange={(e) => handleInputChange('visibilite', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="publique">Public</option>
                <option value="privee">Private</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Notification Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Email notifications for new applications</span>
                </label>
              </div>
            </div>

            {/* Publishing Channels */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Publishing Channels</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sourcesPublication.includes('site')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('sourcesPublication', [...formData.sourcesPublication, 'site']);
                      } else {
                        handleInputChange('sourcesPublication', formData.sourcesPublication.filter(s => s !== 'site'));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Company website</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sourcesPublication.includes('linkedin')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('sourcesPublication', [...formData.sourcesPublication, 'linkedin']);
                      } else {
                        handleInputChange('sourcesPublication', formData.sourcesPublication.filter(s => s !== 'linkedin'));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">LinkedIn</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sourcesPublication.includes('jobboards')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('sourcesPublication', [...formData.sourcesPublication, 'jobboards']);
                      } else {
                        handleInputChange('sourcesPublication', formData.sourcesPublication.filter(s => s !== 'jobboards'));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Job boards</span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
              <p className="text-gray-600 mt-1">Create and publish your job opening</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/company/dashboard')}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit('brouillon')}
                variant="outline"
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSubmit('publiee')}
                disabled={loading || !formData.titre || !formData.description}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                Publish Job
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-px mx-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
              disabled={currentStep === 6}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;