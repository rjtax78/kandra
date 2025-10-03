import React, { useState } from 'react';
import { Filter, X, Calendar, Briefcase, CheckCircle, Clock, Archive, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectItem } from '../ui/select';
import { Label } from '../ui/label';

const JobFilters = ({ filters, onFiltersChange, onClearFilters, isOpen, onToggle }) => {
  const [tempFilters, setTempFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    onToggle();
  };

  const clearFilters = () => {
    const clearedFilters = {
      statut: '',
      typeOffre: '',
      dateRange: '',
      sortBy: 'dateCreated',
      sortOrder: 'desc'
    };
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClearFilters();
  };

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onToggle}
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        Filters
        {(filters.statut || filters.typeOffre || filters.dateRange) && (
          <span className="bg-blue-600 text-white text-xs rounded-full w-2 h-2"></span>
        )}
      </Button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Status
          </Label>
          <Select
            value={tempFilters.statut}
            onValueChange={(value) => handleFilterChange('statut', value)}
            placeholder="All statuses"
          >
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="publiee">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Active
              </div>
            </SelectItem>
            <SelectItem value="brouillon">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                Draft
              </div>
            </SelectItem>
            <SelectItem value="archivee">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-gray-600" />
                Archived
              </div>
            </SelectItem>
            <SelectItem value="expiree">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Expired
              </div>
            </SelectItem>
            <SelectItem value="pourvue">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Filled
              </div>
            </SelectItem>
          </Select>
        </div>

        {/* Job Type Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Job Type
          </Label>
          <Select
            value={tempFilters.typeOffre}
            onValueChange={(value) => handleFilterChange('typeOffre', value)}
            placeholder="All types"
          >
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="emploi">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Employment
              </div>
            </SelectItem>
            <SelectItem value="stage">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Internship
              </div>
            </SelectItem>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Posted
          </Label>
          <Select
            value={tempFilters.dateRange}
            onValueChange={(value) => handleFilterChange('dateRange', value)}
            placeholder="Any time"
          >
            <SelectItem value="">Any Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
          </Select>
        </div>

        {/* Sort Options */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Sort By
          </Label>
          <Select
            value={`${tempFilters.sortBy}-${tempFilters.sortOrder}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              handleFilterChange('sortBy', sortBy);
              handleFilterChange('sortOrder', sortOrder);
            }}
          >
            <SelectItem value="dateCreated-desc">Newest First</SelectItem>
            <SelectItem value="dateCreated-asc">Oldest First</SelectItem>
            <SelectItem value="titre-asc">Title A-Z</SelectItem>
            <SelectItem value="titre-desc">Title Z-A</SelectItem>
            <SelectItem value="applicants-desc">Most Applications</SelectItem>
            <SelectItem value="applicants-asc">Least Applications</SelectItem>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="text-gray-600 hover:text-gray-800"
        >
          Clear All
        </Button>
        <Button
          size="sm"
          onClick={applyFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Apply Filters
        </Button>
      </div>

      {/* Active Filters Summary */}
      {(tempFilters.statut || tempFilters.typeOffre || tempFilters.dateRange) && (
        <div className="pt-2 border-t">
          <p className="text-sm text-gray-600 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {tempFilters.statut && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Status: {tempFilters.statut}
              </span>
            )}
            {tempFilters.typeOffre && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Type: {tempFilters.typeOffre}
              </span>
            )}
            {tempFilters.dateRange && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                Date: {tempFilters.dateRange}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilters;