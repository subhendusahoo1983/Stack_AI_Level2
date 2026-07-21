import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  Snowflake, 
  CloudLightning, 
  HelpCircle,
  LucideIcon
} from 'lucide-react';

export interface WeatherUI {
  label: string;
  description: string;
  icon: LucideIcon;
  gradientClass: string; // Tailwind class for current weather banner
  accentColor: string; // Tailwind text/bg color for active states
  isRain: boolean;
  isSnow: boolean;
}

export const getWeatherUI = (code: number): WeatherUI => {
  // Map WMO Weather Codes to descriptive UI configurations
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        description: 'Bright and sunny. Great visibility.',
        icon: Sun,
        gradientClass: 'from-amber-400 via-orange-400 to-sky-400',
        accentColor: 'amber',
        isRain: false,
        isSnow: false,
      };
    case 1:
      return {
        label: 'Mainly Clear',
        description: 'Mostly sunny with occasional passing clouds.',
        icon: CloudSun,
        gradientClass: 'from-sky-400 via-blue-400 to-slate-300',
        accentColor: 'sky',
        isRain: false,
        isSnow: false,
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'A mix of sun and clouds.',
        icon: CloudSun,
        gradientClass: 'from-blue-400 to-slate-300',
        accentColor: 'blue',
        isRain: false,
        isSnow: false,
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Gray, solid cloud cover. No sun visible.',
        icon: Cloud,
        gradientClass: 'from-slate-500 to-slate-300',
        accentColor: 'slate',
        isRain: false,
        isSnow: false,
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        description: 'Heavy fog. Reduced visibility on roads.',
        icon: CloudFog,
        gradientClass: 'from-slate-600 via-zinc-400 to-zinc-300',
        accentColor: 'zinc',
        isRain: false,
        isSnow: false,
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: 'Light misty rain falling continuously.',
        icon: CloudDrizzle,
        gradientClass: 'from-slate-400 via-blue-300 to-indigo-200',
        accentColor: 'indigo',
        isRain: true,
        isSnow: false,
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Misty rain freezing upon hitting surfaces.',
        icon: CloudDrizzle,
        gradientClass: 'from-slate-500 via-cyan-300 to-blue-200',
        accentColor: 'cyan',
        isRain: true,
        isSnow: true,
      };
    case 61:
    case 63:
    case 65:
      return {
        label: 'Rainy',
        description: 'Steady rain showers falling.',
        icon: CloudRain,
        gradientClass: 'from-blue-600 via-slate-500 to-indigo-900',
        accentColor: 'blue',
        isRain: true,
        isSnow: false,
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Rain freezing instantly on contacts. Slick ice hazards.',
        icon: CloudRain,
        gradientClass: 'from-sky-700 via-cyan-400 to-indigo-800',
        accentColor: 'sky',
        isRain: true,
        isSnow: true,
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Snowy',
        description: 'Steady snowfall accumulating on the ground.',
        icon: Snowflake,
        gradientClass: 'from-blue-400 via-sky-300 to-slate-100',
        accentColor: 'sky',
        isRain: false,
        isSnow: true,
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        description: 'Sudden, heavy downpours of rain.',
        icon: CloudRain,
        gradientClass: 'from-blue-700 via-slate-600 to-slate-400',
        accentColor: 'blue',
        isRain: true,
        isSnow: false,
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Sudden, brief bursts of heavy snow.',
        icon: Snowflake,
        gradientClass: 'from-cyan-600 via-slate-400 to-slate-100',
        accentColor: 'cyan',
        isRain: false,
        isSnow: true,
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Thunder and lightning with rain showers.',
        icon: CloudLightning,
        gradientClass: 'from-purple-800 via-slate-700 to-slate-900',
        accentColor: 'purple',
        isRain: true,
        isSnow: false,
      };
    case 96:
    case 99:
      return {
        label: 'Storm with Hail',
        description: 'Severe thunderstorm with hail accumulation.',
        icon: CloudLightning,
        gradientClass: 'from-purple-950 via-slate-800 to-slate-950',
        accentColor: 'violet',
        isRain: true,
        isSnow: false,
      };
    default:
      return {
        label: 'Unknown Weather',
        description: 'Undetermined conditions.',
        icon: HelpCircle,
        gradientClass: 'from-slate-400 to-slate-200',
        accentColor: 'slate',
        isRain: false,
        isSnow: false,
      };
  }
};

export interface Recommendation {
  clothing: string;
  activity: string;
  activityRating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  alerts: string[];
}

export const getPlanningRecommendations = (
  temp: number,
  weatherCode: number,
  precipSum: number,
  uvMax: number = 0,
  windSpeed: number = 0
): Recommendation => {
  const ui = getWeatherUI(weatherCode);
  const alerts: string[] = [];

  // 1. Clothing advice based on temperature & precipitation
  let clothing = '';
  if (temp >= 30) {
    clothing = 'Extremely warm. Wear light, loose-fitting, breathable clothes (cotton or linen), shorts, sunglasses, and a wide-brimmed sun hat.';
  } else if (temp >= 20 && temp < 30) {
    clothing = 'Comfortable and warm. Great for t-shirts, light shirts, trousers, or skirts. Keep sunglasses handy.';
  } else if (temp >= 12 && temp < 20) {
    clothing = 'Pleasant but mild. Ideal for layering: wear a t-shirt with a light sweater, cardigan, or a denim jacket.';
  } else if (temp >= 5 && temp < 12) {
    clothing = 'Chilly weather. Dress in warm layers, a cozy sweater or light coat, long pants, and closed-toe shoes.';
  } else {
    clothing = 'Freezing! Bundle up in a heavy winter coat, warm thermal layers, a scarf, gloves, and a beanie to protect from heat loss.';
  }

  // Adjust clothing for precipitation
  if (ui.isRain || precipSum > 1.0) {
    clothing += ' Wet conditions expected: carry a sturdy umbrella, wear a waterproof raincoat, and choose water-resistant shoes.';
  } else if (ui.isSnow) {
    clothing += ' Snowing: put on warm, insulated winter boots, gloves, and windproof outer layers.';
  }

  // 2. Activity advice and ratings based on conditions
  let activity = '';
  let activityRating: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Good';

  const isStorm = weatherCode >= 95;
  const isHeavyRainSnow = weatherCode === 65 || weatherCode === 75 || weatherCode === 82 || weatherCode === 86;

  if (isStorm || isHeavyRainSnow) {
    activityRating = 'Poor';
    activity = 'Severe weather conditions outside. Avoid outdoor journeys. Best suited for cozy indoor activities like baking, reading a book, family board games, or caught up with indoor exercises.';
  } else if (ui.isRain || ui.isSnow || temp <= 2) {
    activityRating = 'Fair';
    activity = 'Wet or frosty conditions outside. Indoor excursions are highly recommended, such as visiting a museum, catching a movie, visiting a gym, or cozying up in a cafe with hot drinks.';
  } else if (temp > 35) {
    activityRating = 'Fair';
    activity = 'Extreme heat advisory. Restrict intensive outdoor activities to early morning or late evening. Stick to air-conditioned indoor spaces, swim, and hydrate constantly.';
  } else if (temp >= 16 && temp <= 28 && !ui.isRain) {
    activityRating = 'Excellent';
    activity = 'Outstanding day for the outdoors! Highly recommend taking a scenic hike, cycling, a picnic in the park, jogging, or dining al-fresco.';
  } else {
    // mild but cloudy, or chilly but dry
    activityRating = 'Good';
    activity = 'Decent weather for stepping out. Perfect for a brisk walk, exploring town, running errands, or general travel. Just dress comfortably for the temperature.';
  }

  // 3. Smart notifications / alerts
  if (uvMax >= 6) {
    alerts.push(`High UV Index (${uvMax}): Apply sunscreen (SPF 30+), wear a hat, and minimize direct midday sun exposure.`);
  } else if (uvMax >= 3 && uvMax < 6) {
    alerts.push(`Moderate UV (${uvMax}): Sun protection is recommended for outdoor durations longer than 20 minutes.`);
  }

  if (windSpeed >= 25) {
    alerts.push(`High Winds (${windSpeed} km/h): Brisk gust alert. Secure loose outdoor furniture; secure hats/umbrellas while walking.`);
  }

  if (temp <= 0) {
    alerts.push('Sub-zero Temperatures: Watch out for frost on pathways and ensure pipes are well protected.');
  }

  if (precipSum > 5.0) {
    alerts.push(`Heavy Precipitation expected (${precipSum} mm): Check road updates for potential minor pooling or ponding.`);
  }

  return {
    clothing,
    activity,
    activityRating,
    alerts,
  };
};
