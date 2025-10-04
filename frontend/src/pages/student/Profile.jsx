import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  Briefcase,
  Edit3,
  Save,
  X,
  ArrowLeft,
  Camera,
  Upload,
  FileText,
  Award,
  Star,
  Globe,
  Github,
  Linkedin,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import studentProfileApi from '../../services/studentProfileApi';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    // Basic Info
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.telephone || '',
    location: 'Dakar, Sénégal',
    bio: '',
    
    // Academic Info
    level: 'Master 2',
    field: 'Génie Informatique',
    university: 'Université Cheikh Anta Diop',
    graduationYear: '2025',
    gpa: '',
    
    // Professional Info
    jobTitle: 'Développeur Full Stack Junior',
    experience: '1 year',
    
    // Links
    portfolio: '',
    linkedin: '',
    github: '',
    website: '',
    
    // Skills
    skills: [
      { name: 'JavaScript', level: 'Advanced' },
      { name: 'React', level: 'Advanced' },
      { name: 'Node.js', level: 'Intermediate' },
      { name: 'Python', level: 'Intermediate' },
      { name: 'MySQL', level: 'Intermediate' }
    ],
    
    // Languages
    languages: [
      { name: 'Français', level: 'Native' },
      { name: 'English', level: 'Fluent' },
      { name: 'Wolof', level: 'Native' }
    ],
    
    // Projects
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution built with React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        link: 'https://github.com/user/ecommerce'
      }
    ],
    
    // Certifications
    certifications: [
      {
        name: 'React Developer Certification',
        issuer: 'Meta',
        date: '2024',
        link: '#'
      }
    ]
  });
  
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });
  const [newLanguage, setNewLanguage] = useState({ name: '', level: 'Beginner' });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    technologies: '',
    link: ''
  });

  // Load profile data from backend on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading profile data...');
        const response = await studentProfileApi.getProfile();
        
        if (response && (response.profil || response.firstName || response.id)) {
          // Handle response structure (could be response.profil or direct response)
          const profile = response.profil || response;
          
          console.log('Received profile data:', profile);
          
          setProfileData({
            // Basic Info
            firstName: profile.firstName || user?.firstName || '',
            lastName: profile.lastName || user?.lastName || '',
            email: profile.email || user?.email || '',
            phone: profile.phone || user?.telephone || '',
            location: profile.location || 'Dakar, Sénégal',
            bio: profile.bio || '',
            
            // Academic Info
            level: profile.level || 'Master 2',
            field: profile.field || 'Génie Informatique',
            university: profile.university || 'Université Cheikh Anta Diop',
            graduationYear: profile.graduationYear || '2025',
            gpa: profile.gpa || '',
            
            // Professional Info
            jobTitle: profile.jobTitle || 'Développeur Full Stack Junior',
            experience: profile.experience || '1 year',
            
            // Links
            portfolio: profile.portfolio || '',
            linkedin: profile.linkedin || '',
            github: profile.github || '',
            website: profile.website || '',
            
            // Skills - use backend data or fallback to defaults
            skills: profile.skills && Array.isArray(profile.skills) ? profile.skills : [
              { name: 'JavaScript', level: 'Advanced' },
              { name: 'React', level: 'Advanced' },
              { name: 'Node.js', level: 'Intermediate' },
              { name: 'Python', level: 'Intermediate' },
              { name: 'MySQL', level: 'Intermediate' }
            ],
            
            // Languages
            languages: profile.languages && Array.isArray(profile.languages) ? profile.languages : [
              { name: 'Français', level: 'Native' },
              { name: 'English', level: 'Fluent' },
              { name: 'Wolof', level: 'Native' }
            ],
            
            // Projects
            projects: profile.projects && Array.isArray(profile.projects) ? profile.projects : [
              {
                name: 'E-commerce Platform',
                description: 'Full-stack e-commerce solution built with React and Node.js',
                technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                link: 'https://github.com/user/ecommerce'
              }
            ],
            
            // Certifications
            certifications: profile.certifications && Array.isArray(profile.certifications) ? profile.certifications : [
              {
                name: 'React Developer Certification',
                issuer: 'Meta',
                date: '2024',
                link: '#'
              }
            ]
          });
        } else {
          // Use default data if no profile found
          console.log('No profile data found, using defaults');
          setProfileData(prev => ({
            ...prev,
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: user?.telephone || ''
          }));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Erreur lors du chargement du profil');
        
        // Use user data as fallback
        setProfileData(prev => ({
          ...prev,
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          phone: user?.telephone || ''
        }));
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProfileData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      console.log('Saving profile data to backend:', profileData);
      
      const response = await studentProfileApi.updateProfile(profileData);
      
      console.log('Profile saved successfully:', response);
      
      // Show success message
      if (response.success) {
        alert('Profil mis à jour avec succès!');
      }
      
      setIsEditing(false);
      setEditingSection(null);
    } catch (err) {
      console.error('Error saving profile:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la sauvegarde';
      setError(errorMessage);
      alert(`Erreur: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingSection(null);
    // Reset any unsaved changes if needed
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, { ...newSkill }]
      }));
      setNewSkill({ name: '', level: 'Beginner' });
    }
  };

  const removeSkill = (index) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.name.trim()) {
      setProfileData(prev => ({
        ...prev,
        languages: [...prev.languages, { ...newLanguage }]
      }));
      setNewLanguage({ name: '', level: 'Beginner' });
    }
  };

  const removeLanguage = (index) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    if (newProject.name.trim() && newProject.description.trim()) {
      const project = {
        ...newProject,
        technologies: newProject.technologies.split(',').map(t => t.trim()).filter(t => t)
      };
      setProfileData(prev => ({
        ...prev,
        projects: [...prev.projects, project]
      }));
      setNewProject({
        name: '',
        description: '',
        technologies: '',
        link: ''
      });
    }
  };

  const removeProject = (index) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const getSkillLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'advanced': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'beginner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'native': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'fluent': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Show loading spinner while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4 mt-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/student/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your profile information and skills</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Photo & Basic Info */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                    {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50">
                      <Camera className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </div>
                
                {isEditing && editingSection === 'basic' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="First Name"
                        className="text-center"
                      />
                      <Input
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Last Name"
                        className="text-center"
                      />
                    </div>
                    <Input
                      value={profileData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      placeholder="Job Title"
                      className="text-center"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-gray-600 mb-2">{profileData.jobTitle}</p>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSection('basic')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-center text-sm text-gray-500 mt-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profileData.location}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing && editingSection === 'contact' ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Email address"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <Input
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <Input
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Location"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{profileData.location}</span>
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSection('contact')}
                        className="text-blue-600 hover:text-blue-700 w-full"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit Contact Info
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing && editingSection === 'social' ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-gray-400" />
                      <Input
                        value={profileData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="LinkedIn profile URL"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-gray-400" />
                      <Input
                        value={profileData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        placeholder="GitHub profile URL"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <Input
                        value={profileData.portfolio}
                        onChange={(e) => handleInputChange('portfolio', e.target.value)}
                        placeholder="Portfolio website URL"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {profileData.linkedin && (
                      <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn Profile
                      </a>
                    )}
                    {profileData.github && (
                      <a href={profileData.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                        <Github className="h-4 w-4" />
                        GitHub Profile
                      </a>
                    )}
                    {profileData.portfolio && (
                      <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700">
                        <Globe className="h-4 w-4" />
                        Portfolio Website
                      </a>
                    )}
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSection('social')}
                        className="text-blue-600 hover:text-blue-700 w-full"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit Links
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio/About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    About Me
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection(editingSection === 'bio' ? null : 'bio')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing && editingSection === 'bio' ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself, your interests, career goals, and what makes you unique..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {profileData.bio || (
                      <span className="text-gray-400 italic">
                        Add a bio to help employers learn more about you...
                      </span>
                    )}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Academic Information
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection(editingSection === 'academic' ? null : 'academic')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing && editingSection === 'academic' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                      <Input
                        value={profileData.level}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                        placeholder="e.g., Master 2, Licence 3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                      <Input
                        value={profileData.field}
                        onChange={(e) => handleInputChange('field', e.target.value)}
                        placeholder="e.g., Génie Informatique"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                      <Input
                        value={profileData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        placeholder="University name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                      <Input
                        value={profileData.graduationYear}
                        onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                        placeholder="2025"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Level</p>
                      <p className="text-gray-600">{profileData.level}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Field of Study</p>
                      <p className="text-gray-600">{profileData.field}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">University</p>
                      <p className="text-gray-600">{profileData.university}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Graduation Year</p>
                      <p className="text-gray-600">{profileData.graduationYear}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Skills & Expertise
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection(editingSection === 'skills' ? null : 'skills')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.skills.map((skill, index) => (
                    <div key={index} className="relative group">
                      <Badge className={`${getSkillLevelColor(skill.level)} border px-3 py-1`}>
                        {skill.name} - {skill.level}
                      </Badge>
                      {isEditing && editingSection === 'skills' && (
                        <button
                          onClick={() => removeSkill(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {isEditing && editingSection === 'skills' && (
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        value={newSkill.name}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Skill name"
                      />
                    </div>
                    <div className="w-32">
                      <select
                        value={newSkill.level}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <Button onClick={addSkill} size="sm" className="px-3">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Languages
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection(editingSection === 'languages' ? null : 'languages')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.languages.map((language, index) => (
                    <div key={index} className="relative group">
                      <Badge className={`${getSkillLevelColor(language.level)} border px-3 py-1`}>
                        {language.name} - {language.level}
                      </Badge>
                      {isEditing && editingSection === 'languages' && (
                        <button
                          onClick={() => removeLanguage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {isEditing && editingSection === 'languages' && (
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        value={newLanguage.name}
                        onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Language name"
                      />
                    </div>
                    <div className="w-32">
                      <select
                        value={newLanguage.level}
                        onChange={(e) => setNewLanguage(prev => ({ ...prev, level: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Conversational">Conversational</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Native">Native</option>
                      </select>
                    </div>
                    <Button onClick={addLanguage} size="sm" className="px-3">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Projects
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection(editingSection === 'projects' ? null : 'projects')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                      {isEditing && editingSection === 'projects' && (
                        <button
                          onClick={() => removeProject(index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <h4 className="font-semibold text-gray-900 mb-2">{project.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
                        >
                          View Project
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                  
                  {isEditing && editingSection === 'projects' && (
                    <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                      <h4 className="font-medium text-gray-700">Add New Project</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={newProject.name}
                          onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Project name"
                        />
                        <Input
                          value={newProject.link}
                          onChange={(e) => setNewProject(prev => ({ ...prev, link: e.target.value }))}
                          placeholder="Project link (optional)"
                        />
                      </div>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Project description"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <Input
                        value={newProject.technologies}
                        onChange={(e) => setNewProject(prev => ({ ...prev, technologies: e.target.value }))}
                        placeholder="Technologies used (comma separated)"
                      />
                      <Button onClick={addProject} size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Project
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;