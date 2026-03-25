// Deterministic weather simulation based on city + date
// No external API needed - uses season + city for MVP

export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'humid' | 'windy' | 'dust';

export interface WeatherData {
  temp: number;
  condition: WeatherCondition;
  humidity: number;
  dust: boolean;
  icon: string;
  label: string;
}

export const CITIES = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '제주'] as const;
export type City = (typeof CITIES)[number];

// Simple deterministic hash from string
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function getSeasonRange(month: number): { minTemp: number; maxTemp: number; conditions: WeatherCondition[] } {
  if (month === 12 || month === 1 || month === 2) {
    return { minTemp: -5, maxTemp: 5, conditions: ['snow', 'clear', 'cloudy'] };
  }
  if (month >= 3 && month <= 5) {
    return { minTemp: 8, maxTemp: 20, conditions: ['clear', 'rain', 'cloudy', 'dust'] };
  }
  if (month >= 6 && month <= 8) {
    return { minTemp: 25, maxTemp: 35, conditions: ['humid', 'rain', 'clear'] };
  }
  // fall: 9-11
  return { minTemp: 10, maxTemp: 22, conditions: ['clear', 'windy', 'cloudy'] };
}

function getCityTempAdjustment(city: City, month: number): number {
  if (city === '제주') return 3;
  if (city === '부산') return 2;
  if (city === '대구' && month >= 6 && month <= 8) return 2;
  if (city === '인천') return -1;
  return 0;
}

const CONDITION_ICONS: Record<WeatherCondition, string> = {
  clear: '\u2600\uFE0F',
  cloudy: '\u26C5',
  rain: '\uD83C\uDF27\uFE0F',
  snow: '\u2744\uFE0F',
  humid: '\uD83D\uDCA8',
  windy: '\uD83C\uDF2C\uFE0F',
  dust: '\uD83C\uDF2B\uFE0F',
};

const CONDITION_LABELS: Record<WeatherCondition, string> = {
  clear: '맑음',
  cloudy: '흐림',
  rain: '비',
  snow: '눈',
  humid: '습함',
  windy: '바람',
  dust: '미세먼지',
};

export function getSeasonalWeather(city: City, date: Date = new Date()): WeatherData {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${city}-${date.getFullYear()}-${month}-${day}`;
  const hash = hashCode(dateStr);

  const { minTemp, maxTemp, conditions } = getSeasonRange(month);
  const cityAdj = getCityTempAdjustment(city, month);

  // Deterministic temp within range
  const tempRange = maxTemp - minTemp;
  const temp = minTemp + (hash % (tempRange + 1)) + cityAdj;

  // Deterministic condition
  const conditionIndex = (hash >> 4) % conditions.length;
  const condition = conditions[conditionIndex];

  // Humidity based on condition
  let humidity = 40 + (hash % 30);
  if (condition === 'humid' || condition === 'rain') humidity = 70 + (hash % 20);
  if (condition === 'snow') humidity = 50 + (hash % 15);

  // Dust: spring probability
  const dust = condition === 'dust' || (month >= 3 && month <= 5 && (hash % 5) === 0);

  return {
    temp,
    condition: dust && condition !== 'dust' ? 'dust' : condition,
    humidity,
    dust,
    icon: dust ? CONDITION_ICONS.dust : CONDITION_ICONS[condition],
    label: dust ? CONDITION_LABELS.dust : CONDITION_LABELS[condition],
  };
}

export function getWeatherEmoji(condition: WeatherCondition): string {
  return CONDITION_ICONS[condition];
}

export function getSeasonLabel(month: number): string {
  if (month === 12 || month === 1 || month === 2) return '겨울';
  if (month >= 3 && month <= 5) return '봄';
  if (month >= 6 && month <= 8) return '여름';
  return '가을';
}
