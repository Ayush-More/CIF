'use client';
import { Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react'; // Import X icon for close button

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={searchRef}
      className={`relative w-full md:max-w-2xl mx-auto `}
    >
      <div
        className={`flex items-center bg-white rounded-full transition-all duration-200 
          ${
            isFocused
              ? 'shadow-lg border-[#EF5744]'
              : 'shadow-md border-transparent'
          } border`}
      >
        <div className="pl-4">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search by location, services, or keywords..."
          className="w-full px-3 py-3 text-[15px] rounded-full outline-none bg-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="pr-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}