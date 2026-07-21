import React, { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';

interface SearchHeaderProps {
  onSearch: (cityName: string) => void;
  isLoading: boolean;
  currentCityName?: string;
}

const POPULAR_CITIES = [
  { name: 'New York', code: 'US' },
  { name: 'London', code: 'GB' },
  { name: 'Tokyo', code: 'JP' },
  { name: 'Sydney', code: 'AU' },
  { name: 'Cairo', code: 'EG' },
  { name: 'Reykjavik', code: 'IS' },
];

export default function SearchHeader({ onSearch, isLoading, currentCityName }: SearchHeaderProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleQuickSelect = (cityName: string) => {
    if (!isLoading) {
      setQuery(cityName);
      onSearch(cityName);
    }
  };

  return (
    <div id="search-header-container" className="w-full bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-xl p-5 sm:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Branding & Subtitle */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              Weather Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Real-time atmospheric analysis, 7-day predictive models, and smart planning advice.
          </p>
        </div>

        {/* Search input Form */}
        <form onSubmit={handleSubmit} className="relative flex-1 max-w-md w-full">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-500" />
            <input
              id="city-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city (e.g. Paris, Tokyo...)"
              disabled={isLoading}
              className="w-full pl-10 pr-12 py-2.5 text-sm font-sans bg-slate-950 hover:bg-slate-950/90 focus:bg-slate-950 rounded-xl border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 text-slate-200 placeholder:text-slate-600 disabled:opacity-60"
            />
            {query && (
              <button
                id="clear-search-button"
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-20 p-1 text-slate-500 hover:text-slate-300 rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              id="search-submit-button"
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-all duration-150 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-indigo-600/10"
            >
              {isLoading ? '...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Select Grid */}
      <div className="mt-4 pt-4 border-t border-slate-800/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono font-medium text-slate-500 tracking-wider uppercase mr-1">
            Quick Analysis:
          </span>
          {POPULAR_CITIES.map((city) => {
            const isSelected = currentCityName?.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                id={`quick-select-${city.name.toLowerCase()}`}
                key={city.name}
                type="button"
                onClick={() => handleQuickSelect(city.name)}
                disabled={isLoading}
                className={`px-3 py-1 text-xs rounded-lg border font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-sm font-semibold'
                    : 'bg-slate-900/40 hover:bg-slate-800/80 hover:border-slate-700 text-slate-400 border-slate-800/80'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <MapPin className={`h-3 w-3 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                {city.name}
                <span className="text-[9px] text-slate-500 font-mono">({city.code})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
