import React, { useState, useEffect } from 'react';
import { Search, History } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchQuery } from '../../store/slices/filterSlice';
import { fetchJobs } from '../../store/slices/jobSlice';

const SearchBar = ({ placeholder = "Search your job", onSearch, className = "" }) => {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector(state => state.filters);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [recentSearches] = useState(['Product Designer', 'UI/UX Designer', 'Frontend Developer']);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (query = localQuery) => {
    if (query.trim()) {
      dispatch(setSearchQuery(query.trim()));
      if (onSearch) {
        onSearch(query.trim());
      }
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
        />
        <button
          onClick={() => handleSearch()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Search
        </button>
      </div>

      {/* Recent Searches Suggestions */}
      {showSuggestions && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 mt-2">
          <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b">
            Recent searches
          </div>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(search)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <History className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{search}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;