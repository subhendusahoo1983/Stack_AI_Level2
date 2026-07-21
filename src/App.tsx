import { useState, useEffect, useCallback } from 'react';
import SearchHeader from './components/SearchHeader';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import IntelligenceAdvisory from './components/IntelligenceAdvisory';
import ForecastSection from './components/ForecastSection';
import { WeatherData, City } from './types';
import { 
  AlertCircle, 
  RefreshCw, 
  Globe, 
  CloudSun,
  MapPin
} from 'lucide-react';

export default function App() {
  // Application State
  const [currentCityName, setCurrentCityName] = useState<string>('New York');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFahrenheit, setIsFahrenheit] = useState<boolean>(false);

  // Core weather fetcher function
  const fetchWeather = useCallback(async (cityName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch Geocoding information to retrieve coordinates
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
      const geoResponse = await fetch(geocodingUrl);
      
      if (!geoResponse.ok) {
        throw new Error('Failed to reach geocoding service.');
      }
      
      const geoData = await geoResponse.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found. Please try another search.');
      }

      const cityResult = geoData.results[0];
      const cityObj: City = {
        name: cityResult.name,
        latitude: cityResult.latitude,
        longitude: cityResult.longitude,
        country: cityResult.country,
        country_code: cityResult.country_code,
        admin1: cityResult.admin1,
      };

      // 2. Fetch standard weather forecast and 7-day daily models
      // Fetching weathercode, temperatures, precipitation sum, max wind speed, and UV index
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cityObj.latitude}&longitude=${cityObj.longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,windspeed_10m_max&timezone=auto`;
      const forecastResponse = await fetch(forecastUrl);

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch predictive weather reports.');
      }

      const forecastData = await forecastResponse.json();

      setWeatherData({
        current: forecastData.current_weather,
        daily: forecastData.daily,
        location: cityObj,
        timezone: forecastData.timezone,
      });
      
      // Update primary state names
      setCurrentCityName(cityObj.name);

    } catch (err: any) {
      console.error('Weather intelligence acquisition error:', err);
      setError(err.message || 'An unexpected error occurred during meteorological lookup.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount, pull default city
  useEffect(() => {
    fetchWeather('New York');
  }, [fetchWeather]);

  const handleToggleUnit = () => {
    setIsFahrenheit((prev) => !prev);
  };

  const handleRetry = () => {
    fetchWeather(currentCityName || 'New York');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col justify-between">
      {/* Upper Navigation bar / Subtle Header */}
      <header id="app-nav-bar" className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50 py-3.5 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20">
              <CloudSun className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-white block">
                Aether Weather
              </span>
              <span className="block text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest leading-none mt-0.5">
                Precision Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>UTC: {new Date().toISOString().substring(11, 16)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1">
        
        {/* Search header & Quick-select controls */}
        <SearchHeader 
          onSearch={fetchWeather} 
          isLoading={isLoading} 
          currentCityName={weatherData?.location?.name || currentCityName}
        />

        {/* Dynamic Display based on API States */}
        {isLoading && !weatherData && (
          /* Initial loading state screen */
          <div id="initial-loading-state" className="w-full bg-slate-900/40 border border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[400px] shadow-xl">
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full animate-spin mb-4 border border-indigo-500/10">
              <RefreshCw className="h-8 w-8" />
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-1">
              Analyzing Atmospheric Coordinates
            </h3>
            <p className="text-sm text-slate-400 max-w-sm text-center font-sans">
              Contacting geocoding arrays and fetching high-resolution 7-day predictive weather models.
            </p>
          </div>
        )}

        {error && (
          /* Error display container */
          <div id="error-display-container" className="w-full bg-slate-900/40 border border-rose-900/40 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[350px] shadow-xl">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full mb-4 border border-rose-500/10">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-1">
              Search Request Failed
            </h3>
            <p className="text-sm text-slate-400 max-w-md text-center font-sans mb-6">
              {error} Please check the spelling of the city or make sure you have internet connectivity.
            </p>
            <div className="flex gap-3">
              <button
                id="error-retry-button"
                onClick={handleRetry}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/15"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry Lookup
              </button>
              <button
                id="error-reset-button"
                onClick={() => fetchWeather('New York')}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-all cursor-pointer border border-slate-800"
              >
                Reset to New York
              </button>
            </div>
          </div>
        )}

        {/* Successful Weather Display Dashboard */}
        {!error && weatherData && (
          <div id="weather-dashboard-layout" className={`transition-opacity duration-300 ${isLoading ? 'opacity-65 pointer-events-none' : 'opacity-100'}`}>
            
            {/* Top Row: Current Weather Details & Intelligence Advisory */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              
              {/* Left Column (5/12 width on desktop): Current Weather Details Card */}
              <div className="lg:col-span-5">
                <CurrentWeatherCard
                  current={weatherData.current}
                  daily={weatherData.daily}
                  location={weatherData.location}
                  isFahrenheit={isFahrenheit}
                  onToggleUnit={handleToggleUnit}
                />
              </div>

              {/* Right Column (7/12 width on desktop): Intelligence Advisory Card */}
              <div className="lg:col-span-7">
                <IntelligenceAdvisory
                  current={weatherData.current}
                  daily={weatherData.daily}
                />
              </div>

            </div>

            {/* Bottom Row: 7-Day Forecast cards */}
            <ForecastSection 
              daily={weatherData.daily} 
              isFahrenheit={isFahrenheit} 
            />

            {/* Minor Live Updating Status Pill */}
            {isLoading && (
              <div className="fixed bottom-6 right-6 bg-slate-950 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-mono font-medium animate-bounce border border-indigo-500/20">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                <span>Refreshing atmospheric models...</span>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Elegant minimalist footer */}
      <footer id="app-footer" className="w-full bg-slate-950 border-t border-slate-900/60 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] bg-slate-900 text-indigo-400 px-1.5 py-0.5 rounded border border-slate-800">v1.1.0</span>
            <span>Made with precision using Open-Meteo Public API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-slate-600" />
            <span>Currently tracking {weatherData?.location?.name || currentCityName}, {weatherData?.location?.country || ''}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
