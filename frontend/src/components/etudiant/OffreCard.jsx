import React from 'react';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { saveJob, unsaveJob } from '../../store/slices/jobSlice';
import Badge from '../common/Badge';
import Button from '../common/Button';

const OffreCard = ({ offre, className = '' }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { savedJobs, appliedJobs } = useAppSelector(state => state.jobs);
  
  const isSaved = savedJobs.includes(offre.id);
  const hasApplied = appliedJobs.includes(offre.id);

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    if (isSaved) {
      dispatch(unsaveJob(offre.id));
    } else {
      dispatch(saveJob(offre.id));
    }
  };

  const handleCardClick = () => {
    navigate(`/etudiant/offres/${offre.id}`);
  };

  const formatTimeAgo = (dateStr) => {
    // For demo purposes, always show "Posted 47 min ago" like in Dokarti
    return "Posted 47 min ago";
  };

  const renderStars = (rating = 0) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Get company logo based on company name
  const getCompanyLogo = (companyName) => {
    const name = companyName.toLowerCase();
    if (name.includes('facebook')) {
      return (
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">f</span>
        </div>
      );
    }
    if (name.includes('google')) {
      return (
        <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold" style={{background: 'linear-gradient(45deg, #4285f4, #ea4335, #fbbc05, #34a853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>G</span>
        </div>
      );
    }
    if (name.includes('paypal')) {
      return (
        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
      );
    }
    if (name.includes('linkedin')) {
      return (
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">in</span>
        </div>
      );
    }
    // Default for other companies
    const colors = ['bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500'];
    const colorIndex = companyName.charCodeAt(0) % colors.length;
    const initial = companyName.charAt(0).toUpperCase();
    
    return (
      <div className={`w-10 h-10 ${colors[colorIndex]} rounded-lg flex items-center justify-center`}>
        <span className="text-white font-bold text-lg">{initial}</span>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer ${className}`}>
      {/* Header with Company Logo and Save Button */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getCompanyLogo(offre.entreprise_nom || 'Company')}
          <div>
            <h3 className="font-semibold text-base text-gray-900 mb-1">
              {offre.titre || offre.Titre}
            </h3>
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <span>{offre.entreprise_nom || offre.EntrepriseNom}</span>
              <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </p>
          </div>
        </div>
        
        <button
          onClick={handleSaveToggle}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current text-blue-600' : ''}`} />
        </button>
      </div>

      {/* Job Type and Experience */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm mb-3">
          {(offre.description || offre.Description || '').slice(0, 120)}...
        </p>
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
          {offre.niveau_experience || 'Expert'}
        </span>
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
          Est. Budget: ${offre.salaire_min ? Math.round(offre.salaire_min) : '8000'}
        </span>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(offre.competences_requises || ['Figma', 'Illustration']).slice(0, 3).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs border border-blue-200">
            {skill}
          </span>
        ))}
        {offre.competences_requises && offre.competences_requises.length > 3 && (
          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs border border-blue-200">
            +{offre.competences_requises.length - 3} more
          </span>
        )}
      </div>

      {/* Footer with Stars and Time */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          {renderStars(offre.rating || Math.floor(Math.random() * 2) + 4)}
        </div>
        <span className="text-xs text-gray-500">
          {formatTimeAgo(offre.date_publication || offre.DatePublication)}
        </span>
      </div>
    </div>
  );
};

export default OffreCard;