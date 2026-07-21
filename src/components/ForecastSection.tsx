import { getWeatherUI } from '../utils/weatherUtils';
import { DailyForecast } from '../types';
import { motion } from 'motion/react';
import { Calendar, Droplets } from 'lucide-react';

interface ForecastSectionProps {
  daily: DailyForecast;
  isFahrenheit: boolean;
}

export default function ForecastSection({ daily, isFahrenheit }: ForecastSectionProps) {
  // Convert temperature to Celsius / Fahrenheit
  const formatTemp = (celsius: number) => {
    if (isFahrenheit) {
      return `${Math.round((celsius * 9) / 5 + 32)}°`;
    }
    return `${Math.round(celsius)}°`;
  };

  // Helper to parse "YYYY-MM-DD" into a local Date without UTC shift
  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (dateStr: string, idx: number) => {
    if (idx === 0) return 'Today';
    const date = parseLocalDate(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Build daily arrays
  const days = daily.time.map((timeStr, idx) => {
    const code = daily.weathercode[idx];
    const maxTemp = daily.temperature_2m_max[idx];
    const minTemp = daily.temperature_2m_min[idx];
    const precip = daily.precipitation_sum[idx];
    const ui = getWeatherUI(code);

    return {
      dateStr: timeStr,
      formattedDate: formatDate(timeStr, idx),
      maxTemp,
      minTemp,
      precip,
      ui,
    };
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div id="forecast-section-container" className="w-full bg-slate-900/40 border border-slate-800 rounded-3xl shadow-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800/80 pb-4">
        <Calendar className="h-5 w-5 text-indigo-400" />
        <h3 className="font-display text-lg font-bold text-white">
          7-Day Predictive Outlook
        </h3>
        <span className="text-xs text-slate-500 font-sans ml-auto">
          Calculated at local timezone
        </span>
      </div>

      <motion.div
        id="forecast-cards-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3"
      >
        {days.map((day, idx) => {
          const Icon = day.ui.icon;
          return (
            <motion.div
              id={`forecast-day-card-${idx}`}
              key={day.dateStr}
              variants={itemVariants}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-between transition-all duration-300 ${
                idx === 0
                  ? 'bg-indigo-500/5 border-indigo-500/30 ring-1 ring-indigo-500/25 shadow-md shadow-indigo-600/5'
                  : 'bg-slate-950/40 hover:bg-slate-900/60 border-slate-800 hover:border-slate-700/80'
              }`}
            >
              {/* Day title */}
              <div className="text-center">
                <span className={`text-xs font-semibold ${idx === 0 ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
                  {day.formattedDate}
                </span>
                {idx === 0 && (
                  <span className="block text-[9px] uppercase tracking-wider text-indigo-400 font-mono font-bold mt-0.5">
                    Current Day
                  </span>
                )}
              </div>

              {/* Weather Icon & label */}
              <div className="my-4 flex flex-col items-center gap-1.5">
                <div className={`p-2 rounded-lg ${
                  idx === 0 ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/15' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  <Icon className="h-6 w-6 animate-pulse-slow" />
                </div>
                <span className="text-[11px] font-sans font-semibold text-slate-300 text-center line-clamp-1">
                  {day.ui.label}
                </span>
              </div>

              {/* Min/Max Temperature */}
              <div className="w-full pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2">
                <span className="text-sm font-bold text-white">
                  {formatTemp(day.maxTemp)}
                </span>
                <span className="text-xs text-slate-600">/</span>
                <span className="text-xs font-medium text-slate-400">
                  {formatTemp(day.minTemp)}
                </span>
              </div>

              {/* Rain amount */}
              <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-slate-500 font-mono">
                <Droplets className="h-3 w-3 text-sky-400" />
                <span>{day.precip.toFixed(1)}mm</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
