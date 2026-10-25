'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CollectionFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: string;
  availability: string;
  sortBy: string;
  brand: string;
}

export default function CollectionFilters({ onFilterChange }: CollectionFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: 'all',
    availability: 'all',
    sortBy: 'featured',
    brand: 'all',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-4">
          Price Range
        </h3>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'All Prices' },
            { value: 'under-100k', label: 'Under PKR 100,000' },
            { value: '100k-200k', label: 'PKR 100,000 - 200,000' },
            { value: '200k-500k', label: 'PKR 200,000 - 500,000' },
            { value: 'over-500k', label: 'Over PKR 500,000' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('priceRange', option.value)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                filters.priceRange === option.value
                  ? 'bg-[#E50920] text-white'
                  : 'text-[#A6A6A6] hover:bg-[#151515] hover:text-[#F5F5F5]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-4">
          Availability
        </h3>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'in-stock', label: 'In Stock' },
            { value: 'low-stock', label: 'Low Stock' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('availability', option.value)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                filters.availability === option.value
                  ? 'bg-[#E50920] text-white'
                  : 'text-[#A6A6A6] hover:bg-[#151515] hover:text-[#F5F5F5]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-4">
          Brand
        </h3>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'All Brands' },
            { value: 'Rolex', label: 'Rolex' },
            { value: 'Rado', label: 'Rado' },
            { value: 'Tissot', label: 'Tissot' },
            { value: 'Omega', label: 'Omega' },
            { value: 'Cartier', label: 'Cartier' },
            { value: 'Seiko', label: 'Seiko' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('brand', option.value)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                filters.brand === option.value
                  ? 'bg-[#E50920] text-white'
                  : 'text-[#A6A6A6] hover:bg-[#151515] hover:text-[#F5F5F5]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-4">
          Sort By
        </h3>
        <div className="space-y-2">
          {[
            { value: 'featured', label: 'Featured' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'newest', label: 'Newest' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('sortBy', option.value)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                filters.sortBy === option.value
                  ? 'bg-[#E50920] text-white'
                  : 'text-[#A6A6A6] hover:bg-[#151515] hover:text-[#F5F5F5]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setFilters({ priceRange: 'all', availability: 'all', sortBy: 'featured', brand: 'all' });
          onFilterChange({ priceRange: 'all', availability: 'all', sortBy: 'featured', brand: 'all' });
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
}
