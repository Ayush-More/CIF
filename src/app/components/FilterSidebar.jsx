import { useState } from 'react';

export default function FilterSidebar({ onFilter, onClearFilters }) {
  const [selectedService, setSelectedService] = useState('');
  const [filters, setFilters] = useState({
    selectedLocation: '',
    availableOn: [],
    hourlyRate: 10, // Start with minimum value
    mealRate: 10,   // Add mealRate for meal service
    overNightCare: false,
    schoolDropOff: false,
    monthlySubscription: false,
    trainingMode: ''
  });

  const services = [
    { id: 'childcare', label: 'Child Care' },
    { id: 'mentalphysical', label: 'Mental & Physical' },
    { id: 'tutoring', label: 'Tutoring' },
    { id: 'meal', label: 'Meal Service' }
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const trainingModes = ['Online', 'In-Person', 'Hybrid'];

 
  // Add the rate change handlers
const handleRateChange = (type, value) => {
  handleFilterChange(type, parseInt(value));
};

  const handleServiceChange = (serviceId) => {
    setSelectedService(serviceId);
    // Reset filters when changing service
    const defaultFilters = {
      selectedLocation: '',
      availableOn: [],
      hourlyRate: 10,
      mealRate: 10,
      overNightCare: false,
      schoolDropOff: false,
      monthlySubscription: false,
      trainingMode: ''
    };
    setFilters(defaultFilters);
    onFilter({ ...defaultFilters, service: serviceId });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilter({ ...newFilters, service: selectedService });
  };

  const handleAvailabilityToggle = (day) => {
    const newDays = filters.availableOn.includes(day)
      ? filters.availableOn.filter(d => d !== day)
      : [...filters.availableOn, day];
    handleFilterChange('availableOn', newDays);
  };

  const handleClearFilters = () => {
    setFilters({
      selectedLocation: '',
      availableOn: [],
      hourlyRate: 10,
      mealRate: 10,
      overNightCare: false,
      schoolDropOff: false,
      monthlySubscription: false,
      trainingMode: ''
    });
    onClearFilters();
  };
  // Return visible filters based on selected service
  const getVisibleFilters = () => {
    if (!selectedService) return [];

    const commonFilters = ['selectedLocation', 'availableOn', 'hourlyRate'];
    
    const serviceFilters = {
      childcare: [...commonFilters, 'overNightCare', 'schoolDropOff'],
      mentalphysical: [...commonFilters, 'trainingMode'],
      tutoring: [...commonFilters],
      meal: [...commonFilters, 'monthlySubscription']
    };

    return serviceFilters[selectedService] || [];
  };

  return (
    <div className="w-full md:w-[280px] bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#101828] text-[17px] font-[600]">Filters</h2>
        <button
          onClick={handleClearFilters}
          className="text-[13px] text-[#EF5744] hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Service Selection */}
      <div className="mb-6">
        <label className="text-[15px] text-[#101828] font-[500] mb-2 block">
          Service Type
        </label>
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceChange(service.id)}
              className={`text-[13px] px-3 py-1 rounded-full border ${
                selectedService === service.id
                  ? 'bg-[#EF5744] text-white border-[#EF5744]'
                  : 'border-gray-200 text-[#101828] hover:border-[#EF5744]'
              }`}
            >
              {service.label}
            </button>
          ))}
        </div>
      </div>

      {selectedService && (
        <>
          {/* Location Filter */}
          {getVisibleFilters().includes('selectedLocation') && (
            <div className="mb-6">
              <label className="text-[15px] text-[#101828] font-[500] mb-2 block">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location"
                value={filters.selectedLocation}
                onChange={(e) => handleFilterChange('selectedLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-[13px] outline-none focus:border-[#EF5744]"
              />
            </div>
          )}

          {/* Available Days Filter */}
          {getVisibleFilters().includes('availableOn') && (
            <div className="mb-6">
              <label className="text-[15px] text-[#101828] font-[500] mb-2 block">
                Available On
              </label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => handleAvailabilityToggle(day)}
                    className={`text-[13px] px-3 py-1 rounded-full border ${
                      filters.availableOn.includes(day)
                        ? 'bg-[#EF5744] text-white border-[#EF5744]'
                        : 'border-gray-200 text-[#101828] hover:border-[#EF5744]'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hourly Rate Filter */}
          {getVisibleFilters().includes('hourlyRate') && (
  <div className="mb-6">
    <label className="text-[15px] text-[#101828] font-[500] mb-2 block">
      {selectedService === 'meal' ? 'Meal Rate' : 'Hourly Rate'}
    </label>
    <p className="text-[14px] font-[600]">
      ${selectedService === 'meal' ? filters.mealRate : filters.hourlyRate}
    </p>
    <div className="w-full items-center slider-container">
      <input
        type="range"
        min="10"
        max="100"
        step="1"
        value={selectedService === 'meal' ? filters.mealRate : filters.hourlyRate}
        onChange={(e) => handleRateChange(
          selectedService === 'meal' ? 'mealRate' : 'hourlyRate',
          e.target.value
        )}
        className="w-full appearance-none cursor-pointer custom-slider"
      />
    </div>
  </div>
)}

{/* Update the style section to handle both sliders */}
<style jsx global>{`
  /* Custom slider container */
  .slider-container {
    height: 8px;
    padding: 0;
    position: relative;
  }

  /* Base slider styling */
  .custom-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 6px;
    background: #fcddda;
    outline: none;
    position: relative;
    z-index: 1;
  }

  /* Filled area styling */
  .custom-slider::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: 6px;
    background: linear-gradient(
      to right,
      #ef5744 0%,
      #ef5744
        calc(
          (var(--value) - var(--min)) * 100% / (var(--max) - var(--min))
        ),
      #fcddda
        calc(
          (var(--value) - var(--min)) * 100% / (var(--max) - var(--min))
        ),
      #fcddda 100%
    );
  }

  /* Filled area for Firefox */
  .custom-slider::-moz-range-track {
    height: 8px;
    border-radius: 6px;
    background: #fcddda;
  }

  .custom-slider::-moz-range-progress {
    height: 12px;
    border-radius: 6px 0 0 6px;
    background: #ef5744;
  }

  /* Thumb styling for Chrome, Safari, Opera */
  .custom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 18px;
    border-radius: 50%;
    background: #ef5744;
    cursor: pointer;
    border: none;
    margin-top: -6px;
    position: relative;
    z-index: 2;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  /* Thumb styling for Firefox */
  .custom-slider::-moz-range-thumb {
    width: 24px;
    height: 18px;
    border-radius: 50%;
    background: #ef5744;
    cursor: pointer;
    border: none;
    position: relative;
    z-index: 2;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  /* Set the CSS variable for the current value */
  .custom-slider {
    --min: 10;
    --max: 100;
    --value: ${selectedService === 'meal' ? filters.mealRate : filters.hourlyRate};
  }
`}</style>

          {/* Child Care Specific Filters */}
          {selectedService === 'childcare' && (
            <div className="mb-6">
              <label className="text-[15px] text-[#101828] font-[500] mb-2 block">
                Additional Services
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.overNightCare}
                    onChange={(e) => handleFilterChange('overNightCare', e.target.checked)}
                    className="rounded border-gray-300 text-[#EF5744] focus:ring-[#EF5744]"
                  />
                  <span className="text-[13px] text-[#475467]">Overnight Care</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.schoolDropOff}
                    onChange={(e) => handleFilterChange('schoolDropOff', e.target.checked)}
                    className="rounded border-gray-300 text-[#EF5744] focus:ring-[#EF5744]"
                  />
                  <span className="text-[13px] text-[#475467]">School Drop-off</span>
                </label>
              </div>
            </div>
          )}

          {/* Mental & Physical Specific Filters */}
          {selectedService === 'mentalphysical' && getVisibleFilters().includes('trainingMode') && (
            <div className="mb-6">
              <label className="text-[15px] text-[#101828] font-[500] mb-2 block">
                Training Mode
              </label>
              <div className="flex flex-wrap gap-2">
                {trainingModes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleFilterChange('trainingMode', mode === filters.trainingMode ? '' : mode)}
                    className={`text-[13px] px-3 py-1 rounded-full border ${
                      filters.trainingMode === mode
                        ? 'bg-[#EF5744] text-white border-[#EF5744]'
                        : 'border-gray-200 text-[#101828] hover:border-[#EF5744]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meal Service Specific Filters */}
          {selectedService === 'meal' && getVisibleFilters().includes('monthlySubscription') && (
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.monthlySubscription}
                  onChange={(e) => handleFilterChange('monthlySubscription', e.target.checked)}
                  className="rounded border-gray-300 text-[#EF5744] focus:ring-[#EF5744]"
                />
                <span className="text-[13px] text-[#475467]">Monthly Subscription</span>
              </label>
            </div>
          )}

        
        </>
      )}
    </div>
  );
}