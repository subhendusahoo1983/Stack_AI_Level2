import { getWeatherUI } from '../utils/weatherUtils';
import { City, CurrentWeather, DailyForecast } from '../types';
import { 
  Wind, 
  Droplet, 
  Sun, 
  ArrowUp, 
  ArrowDown, 
  Compass, 
  Navigation,
  Sparkles
} from 'lucide-react';

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  daily: DailyForecast;
  location: City;
  isFahrenheit: boolean;
  onToggleUnit: () => void;
}

export default function CurrentWeatherCard({
  current,
  daily,
  location,
  isFahrenheit,
  onToggleUnit,
}: CurrentWeatherCardProps) {
  const ui = getWeatherUI(current.weathercode);
  const Icon = ui.icon;

  // Temperature unit conversion helpers
  const formatTemp = (celsius: number) => {
    if (isFahrenheit) {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  // Extract today's high and low
  const todayHigh = daily.temperature_2m_max[0] ?? current.temperature;
  const todayLow = daily.temperature_2m_min[0] ?? current.temperature;
  const todayPrecip = daily.precipitation_sum[0] ?? 0;
  const todayUv = daily.uv_index_max?.[0] ?? 0;

  // Wind direction friendly representation
  const getWindDirectionName = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const idx = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
    return directions[idx];
  };

  return (
    <div id="current-weather-card" className="bg-slate-900/40 border border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full">
      {/* Climatic Banner Background */}
      <div className={`p-6 bg-gradient-to-br ${ui.gradientClass} text-white relative transition-all duration-500 relative overflow-hidden`}>
        {/* Subtle dark glass overlay to make it blend with dark mode */}
        <div className="absolute inset-0 bg-slate-950/20 backdrop-brightness-95 pointer-events-none"></div>

        {/* Unit Toggle inside the banner */}
        <div className="absolute top-4 right-4 flex items-center bg-slate-950/60 backdrop-blur-md rounded-lg p-0.5 border border-slate-800/80 transition-all z-10">
          <button
            id="unit-toggle-celsius"
            onClick={() => isFahrenheit && onToggleUnit()}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              !isFahrenheit 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °C
          </button>
          <button
            id="unit-toggle-fahrenheit"
            onClick={() => !isFahrenheit && onToggleUnit()}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              isFahrenheit 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °F
          </button>
        </div>

        {/* Location & Meta */}
        <div className="mb-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-950/30 backdrop-blur-md rounded-full text-[10px] font-mono tracking-wider uppercase font-medium border border-white/10 mb-2">
            <Sparkles className="h-3 w-3 text-amber-300 fill-amber-300" />
            <span>Currently Analyzing</span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white drop-shadow-md">
            {location.name}
          </h2>
          <p className="text-sm font-sans text-white/80 font-medium">
            {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
          </p>
        </div>

        {/* Main Temperature & Weather Icon row */}
        <div className="flex items-end justify-between mt-4 relative z-10">
          <div>
            <div className="font-display text-6xl sm:text-7xl font-light tracking-tighter drop-shadow-md flex items-start text-white">
              {formatTemp(current.temperature)}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-white">{ui.label}</span>
              <span className="h-1.5 w-1.5 bg-white/50 rounded-full"></span>
              <span className="text-xs text-white/70 font-sans font-medium">
                {current.is_day ? 'Day' : 'Night'}
              </span>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-2 bg-white/10 rounded-full blur-xl group-hover:opacity-100 opacity-60 transition-opacity"></div>
            <Icon className="h-20 w-20 relative text-white drop-shadow-md animate-bounce-slow" />
          </div>
        </div>

        <p className="text-xs text-white/90 mt-4 font-sans leading-relaxed border-t border-white/10 pt-3 italic relative z-10">
          "{ui.description}"
        </p>
      </div>

      {/* Atmospheric Metrics Grid */}
      <div className="p-6 bg-slate-900/20 grid grid-cols-2 gap-4 flex-1 border-t border-slate-800/80">
        {/* High & Low Temp */}
        <div id="metric-temp-range" className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex items-center gap-3 shadow-inner hover:bg-slate-900/30 hover:border-slate-700 transition-all duration-200">
          <div className="p-2.5 bg-orange-500/10 rounded-lg text-orange-400 border border-orange-500/10">
            <Sun className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
              High / Low
            </div>
            <div className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
              <span className="flex items-center text-rose-400 text-xs font-bold">
                <ArrowUp className="h-3 w-3 mr-0.5" />
                {formatTemp(todayHigh)}
              </span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center text-sky-400 text-xs font-bold">
                <ArrowDown className="h-3 w-3 mr-0.5" />
                {formatTemp(todayLow)}
              </span>
            </div>
          </div>
        </div>

        {/* Wind metrics */}
        <div id="metric-wind" className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex items-center gap-3 shadow-inner hover:bg-slate-900/30 hover:border-slate-700 transition-all duration-200">
          <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/10">
            <Wind className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
              Wind Force
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-0.5 flex flex-wrap items-center gap-1">
              <span>{Math.round(current.windspeed)} km/h</span>
              <div className="inline-flex items-center text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono gap-0.5">
                <Navigation 
                  className="h-2 w-2" 
                  style={{ transform: `rotate(${current.winddirection}deg)` }} 
                />
                {getWindDirectionName(current.winddirection)}
              </div>
            </div>
          </div>
        </div>

        {/* Precipitation */}
        <div id="metric-precipitation" className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex items-center gap-3 shadow-inner hover:bg-slate-900/30 hover:border-slate-700 transition-all duration-200">
          <div className="p-2.5 bg-sky-500/10 rounded-lg text-sky-400 border border-sky-500/10">
            <Droplet className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
              Rain / Precip
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-0.5">
              {todayPrecip} mm
            </div>
          </div>
        </div>

        {/* UV Index */}
        <div id="metric-uv-index" className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex items-center gap-3 shadow-inner hover:bg-slate-900/30 hover:border-slate-700 transition-all duration-200">
          <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/10">
            <Compass className="h-4.5 w-4.5 animate-spin-slow" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
              Max UV Index
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-0.5">
              {todayUv} <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">({todayUv >= 6 ? 'High' : todayUv >= 3 ? 'Mod' : 'Low'})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
