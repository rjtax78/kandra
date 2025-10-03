import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchJobs, resetJobs } from '../../store/slices/jobSlice';
import { selectFilterParams } from '../../store/slices/filterSlice';
import SearchBar from '../../components/common/SearchBar';
import FilterSidebar from '../../components/common/FilterSidebar';
import OffreCard from '../../components/etudiant/OffreCard';
import Button from '../../components/common/Button';
import { Search, History } from 'lucide-react';

const OffresListe = () => {
  const dispatch = useAppDispatch();
  const { jobs, isLoading, error, totalJobs } = useAppSelector(state => state.jobs);
  const filterParams = useAppSelector(selectFilterParams);

  useEffect(() => {
    dispatch(resetJobs());
    dispatch(fetchJobs({ ...filterParams, page: 1 }));
  }, [dispatch]);

  const handleApplyFilters = () => {
    dispatch(resetJobs());
    dispatch(fetchJobs({ ...filterParams, page: 1 }));
  };

  const handleSearch = (query) => {
    dispatch(resetJobs());
    dispatch(fetchJobs({ ...filterParams, search: query, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content - Two Column Layout */}
      <div className="flex min-h-screen">
        {/* Filter Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <FilterSidebar onApplyFilters={handleApplyFilters} />
        </div>

        {/* Right Side Content */}
        <div className="flex-1 flex flex-col">
          {/* Header Section with Search */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
            {/* Decorative Stars */}
            <div className="absolute inset-0">
              <div className="absolute top-8 left-1/4 text-white/30 text-2xl">✦</div>
              <div className="absolute top-16 right-1/4 text-white/30 text-lg">+</div>
              <div className="absolute top-12 right-1/3 text-white/30 text-xl">✦</div>
              <div className="absolute bottom-8 left-1/3 text-white/30 text-lg">+</div>
              <div className="absolute bottom-12 right-1/5 text-white/30 text-2xl">✦</div>
            </div>
            
            <div className="relative px-8 py-12 text-white">
              <h1 className="text-3xl font-bold mb-4">
                Find your dream job here
              </h1>
              <p className="text-lg text-white/90 mb-8 max-w-2xl">
                Join Dokarti. Dokarti is a place where you find your dream job in various skills here, 
                you will also get many other benefits
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search your job"
                    className="w-full pl-12 pr-32 py-3 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                    Search
                  </button>
                  {/* Recent searches icon */}
                  <button className="absolute right-20 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600">
                    <History className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Job Cards Area */}
          <div className="flex-1 p-8 bg-white">
            {/* Job Cards Grid */}
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {jobs.map((job, index) => (
                  <OffreCard
                    key={job.id || job.ID || index}
                    offre={job}
                  />
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">
                    No jobs found matching your criteria
                  </div>
                  <p className="text-gray-400 mt-2">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )
            )}

            {/* Loading State */}
            {isLoading && jobs.length === 0 && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffresListe;