'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation'; // Add this import
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';
import SearchCard from '../components/SearchCard';
import Navbar from '../components/Navbar';
import { Filter } from 'lucide-react';
import { toast } from "react-toastify";
import { useSearchParams } from 'next/navigation';

// Define TypeScript interfaces
interface Care {
  _id: string;
  user_id: string;
  category: string;
  location: string;
  username: string;
  profilePic?: string;
  about?: string;
  average_rating?: number;
  total_reviews?: number;
  hourlyRate?: number;
  workingDays?: string[];
  overnightCare?: boolean;
  schoolDrop?: boolean;
  mealPrice?: string;
  offerSubscription?: boolean;
  serviceType?: string;
  mealTypes?: string[];
  ageBand?: string[];
  jobTiming?: string;
  mode?: string;
}

interface Filters {
  service?: string;
  selectedLocation?: string;
  availableOn?: string[];
  hourlyRate?: number;
  overNightCare?: boolean;
  schoolDropOff?: boolean;
  trainingMode?: string;
  monthlySubscription?: boolean;
}

const CATEGORY_MAP: { [key: string]: string } = {
  'Meal Service': 'mealservice',
  'Tutoring': 'tutoring',
  'Child care': 'childcare',
  'Mental and Physical health': 'mentalphysical'
};

function SearchContent() {
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredResults, setFilteredResults] = useState<Care[]>([]);
  const [allResults, setAllResults] = useState<Care[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<{ currentPage: number; totalPages: number } | null>(null);
  const searchParams = useSearchParams();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/cares/list`);
      const result = await response.json();

      if (result.success) {
        setAllResults(result.data.cares);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to fetch data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const applySearchAndFilters = (currentSearchTerm = searchTerm, currentFilters = filters) => {
    let results = [...allResults];

    // Merge URL params into filters
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const urlFilters = {
      ...(location && { selectedLocation: location }),
      ...(type && { service: CATEGORY_MAP[type] || type.toLowerCase().replace(/\s+/g, '') }),
    };
    const combinedFilters = { ...urlFilters, ...currentFilters };

    // Apply search term
    if (currentSearchTerm.trim()) {
      const searchLower = currentSearchTerm.toLowerCase();
      results = results.filter(item =>
        item.location?.toLowerCase().includes(searchLower) ||
        item.username?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower) ||
        item.about?.toLowerCase().includes(searchLower) ||
        item.serviceType?.toLowerCase().includes(searchLower)
      );
    }

    // Apply combined filters
    if (Object.keys(combinedFilters).length > 0) {
      results = results.filter(item => {
        if (combinedFilters.service && item.category?.toLowerCase() !== combinedFilters.service.toLowerCase()) {
          return false;
        }
        if (combinedFilters.selectedLocation && !item.location?.toLowerCase().includes(combinedFilters.selectedLocation.toLowerCase())) {
          return false;
        }
        if (currentFilters.availableOn && currentFilters.availableOn.length > 0) {
          const hasMatchingDays = currentFilters.availableOn.some(day =>
            item.workingDays?.includes(day.substring(0, 3))
          );
          if (!hasMatchingDays) return false;
        }

        if (currentFilters.service === 'mealservice') {
          const mealPrice = parseInt(item.mealPrice?.replace(/[^0-9]/g, '') || '0');
          if (mealPrice < (currentFilters.hourlyRate || 0)) return false;
        } else {
          if ((item.hourlyRate || 0) < (currentFilters.hourlyRate || 0)) return false;
        }

        switch (currentFilters.service) {
          case 'childcare':
            if (currentFilters.overNightCare && !item.overnightCare) return false;
            if (currentFilters.schoolDropOff && !item.schoolDrop) return false;
            break;

          case 'mentalphysical':
            if (currentFilters.trainingMode && item.mode !== currentFilters.trainingMode) return false;
            break;

          case 'mealservice':
            if (currentFilters.monthlySubscription && !item.offerSubscription) return false;
            break;
        }

        return true;
      });
    }

    setFilteredResults(results);
  };

  // Ensure state updates when URL params change
  useEffect(() => {
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const urlFilters = {
      ...(location && { selectedLocation: location }),
      ...(type && { service: CATEGORY_MAP[type] || type.toLowerCase().replace(/\s+/g, '') }),
    };
    setFilters(urlFilters);
  }, [searchParams]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applySearchAndFilters(term, filters);
  };

  const handleFilter = (newFilters: Filters) => {
    setFilters(newFilters);
    applySearchAndFilters(searchTerm, newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setFilteredResults(allResults);

    // Reset URL parameters
    const baseUrl = '/search'; // Define your base `/search` route here
    window.history.pushState({}, '', baseUrl); // Removes all query params
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Search Section */}
      <div className="bg-[#FCF1E8] py-4 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-[13px] text-[#101828]"
          >
            <Filter className="w-4 h-4" />
            Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar
            onFilter={handleFilter}
            onClearFilters={handleClearFilters}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />

          {/* Results */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-[#101828] text-[17px] font-[600]">
                {isLoading ? 'Loading...' : `${filteredResults.length} Results`}
              </h2>
              {pagination && (
                <p className="text-sm text-gray-500">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>
              )}
            </div>

            {isLoading ? (
              // Loading skeleton
              <div className="space-y-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="animate-pulse bg-white rounded-lg h-[225px]"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="mt-[26px] flex flex-col gap-[19px]">
                  {filteredResults.map((result) => (
                    <SearchCard
                      key={result._id}
                      data={{
                        ...result,
                        id: result._id,
                        user_id: result.user_id,
                        category: result.category,
                        location: result.location,
                        username: result.username,
                        profilePic: result.profilePic,
                        about: result.about,
                        average_rating: result.average_rating,
                        total_reviews: result.total_reviews,
                        hourlyRate: result.hourlyRate,
                        workingDays: result.workingDays,
                        overNightCare: result.overnightCare,
                        schoolDropOff: result.schoolDrop,
                        mealPrice: result.mealPrice,
                        offerSubscription: result.offerSubscription,
                        serviceType: result.serviceType,
                        mealTypes: result.mealTypes,
                        ageBand: result.ageBand,
                        jobTiming: result.jobTiming,
                        mode: result.mode
                      }}
                    />
                  ))}
                </div>

                {filteredResults.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[#475467] text-[15px]">
                      No results found for the selected criteria.
                    </p>
                    {(Object.keys(filters).length > 0 || searchTerm) && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-2 text-[#EF5744] text-[13px] hover:underline"
                      >
                        Clear all filters and search
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}