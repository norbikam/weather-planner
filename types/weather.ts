export interface TravelDestination {
  id: string;
  name: string;
  lat: number;
  lng: number;
  temp: number;
  weatherCode: number;
  note: string;
}

export interface WeatherData {
  current_weather: {
    temperature: number;
    weathercode: number;
  };
}