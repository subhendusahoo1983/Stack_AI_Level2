export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  uv_index_max?: number[];
  windspeed_10m_max?: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast;
  location: City;
  timezone: string;
}

export interface WeatherCodeDetails {
  label: string;
  description: string;
  iconName: string; // Used to dynamic select lucide-react icon
  bgGradient: string; // Gradient class for card background
  themeColor: string; // Color code for UI borders/accents
}
