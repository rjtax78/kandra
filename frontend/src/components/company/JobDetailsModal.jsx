import React from 'react';
import { X, MapPin, Bookmark, Share2, FileText, Download, Building2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const JobDetailsModal = ({ job, isOpen, onClose, onEdit }) => {
  if (!isOpen || !job) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExperienceLevel = () => {
    // Mock experience level based on job type or could be from job data
    return job.typeOffre === 'stage' ? '0-1 Years' : '2-4 Years';
  };

  // Mock similar jobs data
  const similarJobs = [
    {
      id: 1,
      title: 'Lead UI Designer',
      company: 'Gojek',
      location: 'Jakarta, Indonesia',
      type: 'Fulltime',
      schedule: 'Onsite',
      experience: '3-5 Years',
      applicants: 521,
      postedTime: '2 day ago'
    },
    {
      id: 2,
      title: 'Sr. UX Designer',
      company: 'GoPay',
      location: 'Jakarta, Indonesia',
      type: 'Fulltime',
      schedule: 'Onsite',
      experience: '3-5 Years',
      applicants: 210,
      postedTime: '2 day ago'
    },
    {
      id: 3,
      title: 'Jr. UI Designer',
      company: 'OVO',
      location: 'Jakarta, Indonesia',
      type: 'Fulltime',
      schedule: 'Onsite',
      experience: '1-3 Years',
      applicants: 120,
      postedTime: 'an hour ago'
    },
    {
      id: 4,
      title: 'UI Designer',
      company: 'Pixelz Studio',
      location: 'Yogyakarta, Indonesia',
      type: 'Internship',
      schedule: 'Onsite',
      experience: 'Fresh Graduate',
      applicants: 35,
      postedTime: 'a day ago'
    },
    {
      id: 5,
      title: 'Frontend End Developer',
      company: 'Pixelz Studio',
      location: 'Yogyakarta, Indonesia',
      type: 'Full Time',
      schedule: 'Onsite',
      experience: '1-3 Years',
      applicants: 35,
      postedTime: 'a day ago'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">WerkLinker</h1>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About Us</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Jobs</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Insight</a>
            </nav>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-full overflow-hidden">
        {/* Left Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
              <div className="flex items-start space-x-4">
                {/* Company Logo */}
                <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.titre}</h1>
                      <div className="flex items-center text-gray-600 mb-4">
                        <span className="text-blue-600 font-medium">Pixelz Studio</span>
                        <span className="mx-2">•</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{job.localisation || 'Yogyakarta, Indonesia'}</span>
                      </div>
                      
                      {/* Job Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          {job.typeOffre === 'emploi' ? 'Fulltime' : 'Internship'}
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full">Remote</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{getExperienceLevel()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 mt-6">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-medium">
                      Apply Now
                    </Button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Bookmark className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {/* About this role */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this role</h2>
                <div className="text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line">{job.description}</p>
                </div>
              </div>

              {/* Qualification */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Qualification</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    At least 2-4 years of relevant experience in product design or related roles.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Knowledge of design validation, either through quantitative or qualitative research.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Have good knowledge using Figma and Figjam
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Experience with analytics tools to gather data from users.
                  </li>
                </ul>
              </div>

              {/* Responsibility */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibility</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Create design and user journey on every features and product/business units across multiples devices (Web+App)
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Identifying design problems through user journey and devising elegant solutions
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Develop low and hi fidelity designs, user experience flow, & prototype, translate it into highly-polished visual composites following style and brand guidelines.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Brainstorm and works together with Design Lead, UX Engineers, and PMs to execute a design sprint on specific story or task
                  </li>
                </ul>
              </div>

              {/* Attachment */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Attachment</h2>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Jobs_Requirement...</p>
                      <p className="text-sm text-gray-500">PDF</p>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Company_Benefit...</p>
                      <p className="text-sm text-gray-500">PDF</p>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Similar Jobs</h3>
            <div className="space-y-4">
              {similarJobs.map((similarJob) => (
                <div key={similarJob.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start space-x-3">
                    {/* Company Logo */}
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">G</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{similarJob.title}</h4>
                      <p className="text-sm text-gray-600">{similarJob.company} • {similarJob.location}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{similarJob.type}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{similarJob.schedule}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{similarJob.experience}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>{similarJob.postedTime} • {similarJob.applicants} Applicants</span>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Other Jobs From Company */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Jobs From Pixelz Studio</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">P</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">UI Designer</h4>
                      <p className="text-sm text-gray-600">Pixelz Studio • Yogyakarta, Indonesia</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Internship</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Onsite</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Fresh Graduate</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>a day ago • 35 Applicants</span>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">P</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Frontend End Developer</h4>
                      <p className="text-sm text-gray-600">Pixelz Studio • Yogyakarta, Indonesia</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Full Time</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Onsite</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">1-3 Years</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>a day ago • 35 Applicants</span>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Button - Company Dashboard specific */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => {
            onEdit(job);
            onClose();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          Edit Job
        </Button>
      </div>
    </div>
  );
};

export default JobDetailsModal;