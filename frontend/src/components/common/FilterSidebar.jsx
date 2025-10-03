import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  setCategory, 
  toggleJobType, 
  toggleExperienceLevel, 
  setSalaryRange, 
  toggleSalaryOption,
  setProposalCount,
  resetFilters,
  toggleFilterPanel
} from '../../store/slices/filterSlice';

const FilterSidebar = ({ onApplyFilters }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.filters);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    jobType: true,
    experience: true,
    salary: true,
    proposals: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const categories = [
    'Anytime',
    'Design & Creative',
    'Development & IT',
    'Marketing',
    'Business',
    'Engineering',
    'Data Science',
    'Finance'
  ];

  const jobTypes = [
    { key: 'full-time', label: 'Full-time', checked: filters.jobTypes['full-time'] },
    { key: 'internship', label: 'Internship', checked: filters.jobTypes.internship },
    { key: 'freelance', label: 'Freelance', checked: filters.jobTypes.freelance },
    { key: 'volunteer', label: 'Volunteer', checked: filters.jobTypes.volunteer },
  ];

  const experienceLevels = [
    { key: 'entry', label: 'Entry level', checked: filters.experienceLevel.entry },
    { key: 'intermediate', label: 'Intermediate', checked: filters.experienceLevel.intermediate },
    { key: 'expert', label: 'Expert', checked: filters.experienceLevel.expert },
  ];

  const salaryOptions = [
    { key: 'under100', label: 'Under $100', checked: filters.salaryRange.under100 },
    { key: '100to1K', label: '$100 to $1K', checked: filters.salaryRange['100to1K'] },
    { key: 'hourly', label: 'Hourly', checked: filters.salaryRange.hourly },
  ];

  const handleCategoryChange = (category) => {
    dispatch(setCategory(category === 'Anytime' ? '' : category));
  };

  const handleJobTypeChange = (jobType) => {
    dispatch(toggleJobType(jobType));
  };

  const handleExperienceChange = (level) => {
    dispatch(toggleExperienceLevel(level));
  };

  const handleSalaryOptionChange = (option) => {
    dispatch(toggleSalaryOption(option));
  };

  const handleSalaryRangeChange = (min, max) => {
    dispatch(setSalaryRange({ min, max }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left py-2 mb-3"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isExpanded && <div>{children}</div>}
    </div>
  );

  return (
    <div className="w-full bg-white h-full overflow-y-auto">
      <div className="p-6">
        {/* Filter Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Filter
          </h2>
        </div>

        {/* Category Filter */}
        <FilterSection
          title="Category"
          isExpanded={expandedSections.category}
          onToggle={() => toggleSection('category')}
        >
          <div className="mb-4">
            <select
              value={filters.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category === 'Anytime' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </FilterSection>

        {/* Job Type Filter */}
        <FilterSection
          title="Job Type"
          isExpanded={expandedSections.jobType}
          onToggle={() => toggleSection('jobType')}
        >
          <div className="space-y-3">
            {jobTypes.map(type => (
              <label key={type.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={type.checked}
                  onChange={() => handleJobTypeChange(type.key)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Experience Level Filter */}
        <FilterSection
          title="Experience level"
          isExpanded={expandedSections.experience}
          onToggle={() => toggleSection('experience')}
        >
          <div className="space-y-3">
            {experienceLevels.map(level => (
              <label key={level.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={level.checked}
                  onChange={() => handleExperienceChange(level.key)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">{level.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Expected Salary Filter */}
        <FilterSection
          title="Expected salary"
          isExpanded={expandedSections.salary}
          onToggle={() => toggleSection('salary')}
        >
          <div className="space-y-4">
            {/* Salary Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">${filters.salaryRange.min}</span>
                <span className="text-sm text-gray-600">${filters.salaryRange.max}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={filters.salaryRange.min}
                  onChange={(e) => handleSalaryRangeChange(parseInt(e.target.value), filters.salaryRange.max)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={filters.salaryRange.max}
                  onChange={(e) => handleSalaryRangeChange(filters.salaryRange.min, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider absolute top-0"
                />
              </div>
            </div>

            {/* Salary Options */}
            <div className="space-y-3">
              {salaryOptions.map(option => (
                <label key={option.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={() => handleSalaryOptionChange(option.key)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Number of Proposals Filter */}
        <FilterSection
          title="Number of proposals"
          isExpanded={expandedSections.proposals}
          onToggle={() => toggleSection('proposals')}
        >
          <div className="space-y-3">
            {['Less than 5', '5 to 10', '10 to 15', '15 to 20', 'More than 20'].map(range => (
              <label key={range} className="flex items-center">
                <input
                  type="radio"
                  name="proposals"
                  value={range}
                  checked={filters.proposalCount === range}
                  onChange={(e) => dispatch(setProposalCount(e.target.value))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">{range}</span>
              </label>
            ))}
          </div>
        </FilterSection>

      </div>
    </div>
  );
};

export default FilterSidebar;