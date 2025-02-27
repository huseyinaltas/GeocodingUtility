// Define the Geolocation type
export interface Geolocation {
  place: string;
  latitude: number;
  longitude: number;
  country: string;
  weather: Weather;
}
export interface Weather {
  place: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCondition: string;
  country: string;
}
