import { getPlanningRecommendations } from '../utils/weatherUtils';
import { CurrentWeather, DailyForecast } from '../types';
import { Shirt, Compass, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface IntelligenceAdvisoryProps {
  current: CurrentWeather;
  daily: DailyForecast;
}

export default function IntelligenceAdvisory({ current, daily }: IntelligenceAdvisoryProps) {
  // Extract today's variables
  const todayHigh = daily.temperature_2m_max[0] ?? current.temperature;
  const todayLow = daily.temperature_2m_min[0] ?? current.temperature;
  const todayPrecip = daily.precipitation_sum[0] ?? 0;
  const todayUv = daily.uv_index_max?.[0] ?? 0;
  const todayWind = daily.windspeed_10m_max?.[0] ?? current.windspeed;

  // Compute recommendations
  const recommendation = getPlanningRecommendations(
    current.temperature,
    current.weathercode,
    todayPrecip,
    todayUv,
    todayWind
  );

  // Styling maps for the Activity Rating Badge in Dark Mode
  const ratingStyles = {
    Excellent: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-500 shadow-sm shadow-emerald-500/50',
    },
    Good: {
      bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      dot: 'bg-indigo-500 shadow-sm shadow-indigo-500/50',
    },
    Fair: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      dot: 'bg-amber-500 shadow-sm shadow-amber-500/50',
    },
    Poor: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      dot: 'bg-rose-500 shadow-sm shadow-rose-500/50',
    },
  };

  const selectedRatingStyle = ratingStyles[recommendation.activityRating] || ratingStyles.Good;

  return (
    <div id="intelligence-advisory" className="bg-slate-900/40 border border-slate-800 rounded-3xl shadow-xl p-6 h-full flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
          <Compass className="h-5 w-5 text-indigo-400" />
          <h3 className="font-display text-lg font-bold text-white">
            Advisory & Smart Planning
          </h3>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full font-mono font-medium ml-auto border border-indigo-500/25">
            AI Engine Active
          </span>
        </div>

        {/* 1. Activity Planner Block */}
        <div id="advisory-activity" className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              Outdoor Excursion Index
            </h4>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full border ${selectedRatingStyle.bg}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${selectedRatingStyle.dot}`}></span>
              {recommendation.activityRating}
            </span>
          </div>
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            {recommendation.activity}
          </p>
        </div>

        {/* 2. Clothing Guide Block */}
        <div id="advisory-clothing" className="mb-6 pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Shirt className="h-4 w-4 text-slate-500" />
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              Clothing & Wardrobe Advice
            </h4>
          </div>
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            {recommendation.clothing}
          </p>
        </div>
      </div>

      {/* 3. High Priority Warnings / Safety Alerts */}
      <div id="advisory-alerts" className="pt-4 border-t border-slate-800 mt-auto">
        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-slate-500" />
          Atmospheric Alerts
        </h4>
        
        {recommendation.alerts.length > 0 ? (
          <div className="space-y-2">
            {recommendation.alerts.map((alert, index) => (
              <div 
                id={`alert-bubble-${index}`}
                key={index} 
                className="flex items-start gap-2.5 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs font-sans leading-relaxed"
              >
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{alert}</span>
              </div>
            ))}
          </div>
        ) : (
          <div id="alert-bubble-optimal" className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs font-sans">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Optimal conditions. No safety or high-radiation alerts are active today.</span>
          </div>
        )}
      </div>
    </div>
  );
}
