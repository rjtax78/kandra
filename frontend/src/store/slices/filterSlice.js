import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  category: '',
  jobTypes: {
    'full-time': false,
    'internship': false,
    'freelance': false,
    'volunteer': false,
  },
  experienceLevel: {
    'entry': false,
    'intermediate': false,
    'expert': false,
  },
  salaryRange: {
    min: 10,
    max: 100,
    under100: false,
    '100to1K': false,
    hourly: false,
  },
  proposalCount: '',
  sortBy: 'newest', // newest, oldest, salary-high, salary-low, relevance
  isFilterOpen: false,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    toggleJobType: (state, action) => {
      const jobType = action.payload;
      state.jobTypes[jobType] = !state.jobTypes[jobType];
    },
    setJobType: (state, action) => {
      const { jobType, value } = action.payload;
      state.jobTypes[jobType] = value;
    },
    toggleExperienceLevel: (state, action) => {
      const level = action.payload;
      state.experienceLevel[level] = !state.experienceLevel[level];
    },
    setExperienceLevel: (state, action) => {
      const { level, value } = action.payload;
      state.experienceLevel[level] = value;
    },
    setSalaryRange: (state, action) => {
      const { min, max } = action.payload;
      state.salaryRange.min = min;
      state.salaryRange.max = max;
    },
    toggleSalaryOption: (state, action) => {
      const option = action.payload;
      state.salaryRange[option] = !state.salaryRange[option];
    },
    setProposalCount: (state, action) => {
      state.proposalCount = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    toggleFilterPanel: (state) => {
      state.isFilterOpen = !state.isFilterOpen;
    },
    resetFilters: (state) => {
      return { ...initialState, isFilterOpen: state.isFilterOpen };
    },
    applyFiltersFromQuery: (state, action) => {
      const params = action.payload;
      if (params.search) state.searchQuery = params.search;
      if (params.category) state.category = params.category;
      if (params.sortBy) state.sortBy = params.sortBy;
      // Apply other filters as needed
    },
  },
});

export const {
  setSearchQuery,
  setCategory,
  toggleJobType,
  setJobType,
  toggleExperienceLevel,
  setExperienceLevel,
  setSalaryRange,
  toggleSalaryOption,
  setProposalCount,
  setSortBy,
  toggleFilterPanel,
  resetFilters,
  applyFiltersFromQuery,
} = filterSlice.actions;

// Selectors
export const selectActiveFilters = (state) => {
  const filters = state.filters;
  const activeJobTypes = Object.keys(filters.jobTypes).filter(key => filters.jobTypes[key]);
  const activeExperienceLevels = Object.keys(filters.experienceLevel).filter(key => filters.experienceLevel[key]);
  
  return {
    hasActiveFilters: (
      filters.searchQuery ||
      filters.category ||
      activeJobTypes.length > 0 ||
      activeExperienceLevels.length > 0 ||
      filters.salaryRange.min > 10 ||
      filters.salaryRange.max < 100 ||
      filters.proposalCount
    ),
    activeJobTypes,
    activeExperienceLevels,
  };
};

export const selectFilterParams = (state) => {
  const filters = state.filters;
  const activeJobTypes = Object.keys(filters.jobTypes).filter(key => filters.jobTypes[key]);
  const activeExperienceLevels = Object.keys(filters.experienceLevel).filter(key => filters.experienceLevel[key]);
  
  return {
    search: filters.searchQuery,
    category: filters.category,
    jobType: activeJobTypes.join(','),
    experienceLevel: activeExperienceLevels.join(','),
    minSalary: filters.salaryRange.min,
    maxSalary: filters.salaryRange.max,
    sortBy: filters.sortBy,
  };
};

export default filterSlice.reducer;