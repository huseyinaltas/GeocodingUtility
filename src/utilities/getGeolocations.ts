import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
dotenv.config();

// Define the Geolocation type
interface Geolocation {
  place: string;
  latitude: number;
  longitude: number;
  country: string;
  weather: Weather;
}
interface Weather {
  place: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCondition: string;
  country: string;
}

export async function getGeolocation(
  query: string
): Promise<Geolocation | null | string> {
  try {
    let params: { appid: string; q?: string; zip?: string } = {
      appid: process.env.API_KEY!,
    };
    // Check if it's a city/state format or zip code
    if (query.split(",").length == 2) {
      // City, State format (e.g., "Madison, WI")
      params.q = query + ", US";
    } else if (/^\d{5}$/.test(query)) {
      // Zip code format (5-digit zip code, e.g., "12345")
      params.zip = query;
    } else if (query == "") {
      return (
        query +
        'Please pass an input. Invalid input format. Provide a valid city, state (e.g., "Madison, WI") or a valid zip code (e.g., "12345").'
      );
    } else {
      // If the format doesn't match city/state or zip code, throw an error
      return (
        query +
        ': Invalid input format. Please provide a valid city, state (e.g., "Madison, WI") or a valid zip code (e.g., "12345").'
      );
    }

    // console.log(params);

    const response: AxiosResponse = await axios.get(process.env.BASE_URL!, {
      params,
    });
    // console.log(response);

    if (response.status === 200) {
      const data = response.data;
      // If It is not within US, return error
      if (data.sys.country != "US") {
        return (
          query +
          ": " +
          data.sys.country +
          " is different country than US. Please use a place within in US"
        );
      }
      const weather: Weather = {
        place: data.name,
        temperature: kelvinToFahrenheit(data.main.temp), // Convert temp to Fahrenheit
        feelsLike: kelvinToFahrenheit(data.main.feels_like), // Convert feels_like to Fahrenheit
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        weatherCondition: data.weather[0].description, // Assuming the first weather object contains the condition
        country: data.sys.country,
      };
      const location: Geolocation = {
        place: data.name,
        latitude: data.coord.lat,
        longitude: data.coord.lon,
        country: data.sys.country,
        weather: weather,
      };
      return location;
    } else {
      // If API has returning other than 200 code return API error code and text
      return `Error: ${response.status} - ${response.statusText}`;
    }
  } catch (error: any) {
    // If API has error return API error
    if (error.response && error.response.data)
      return `API Error: ${
        error.response.data.cod + ": " + error.response.data.message
      }`;
    else return error;
  }
}

export async function getGeolocations(
  locations: string[]
): Promise<Geolocation[]> {
  let responses: Geolocation | any = [];

  //Remove duplicate ones
  locations = [...new Set(locations)];

  //Error if input array is empty
  if (locations.length == 0) {
    responses.push(
      'Please pass an input. Invalid input format. Provide a valid city, state (e.g., "Madison, WI") or a valid zip code (e.g., "12345").'
    );
    return responses;
  } else {
    for (const location of locations) {
      try {
        console.log(`Fetching geolocation for: ${location}`);
        const geolocation: Geolocation | any = (await getGeolocation(
          location
        )) as Geolocation;
        console.log(`Place: ${geolocation.place}, ${geolocation.country}`);
        console.log(
          `Latitude: ${geolocation.latitude}, Longitude: ${geolocation.longitude}`
        );
        console.log(`Weather: ${JSON.stringify(geolocation.weather)}`);

        console.log("****************");
        // console.log(geolocation);

        responses.push(geolocation);
      } catch (error: any) {
        console.error(
          `Error fetching geolocation for ${location}:`,
          error.message
        );
      }
    }
  }
  return responses;
}

export function kelvinToFahrenheit(kelvin: number): number {
  return Math.round((kelvin - 273.15) * (9 / 5) + 32);
}
