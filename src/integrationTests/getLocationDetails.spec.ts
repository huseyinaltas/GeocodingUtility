import { test, expect } from "@playwright/test";
import {
  getGeolocations,
  kelvinToFahrenheit,
} from "../utilities/getLocationDetails";
import axios, { AxiosResponse } from "axios";

test("Get only one geo location when you pass a place name", async ({
  page,
}) => {
  let expected = await getGeolocations(["Madison, WI"]);

  expect(expected).toStrictEqual([
    {
      place: "Madison",
      latitude: 43.0731,
      longitude: -89.4012,
      country: "US",
      weather: expected[0].weather,
    },
  ]);
});

test("Get only one geo location when you pass a Zip Code", async ({ page }) => {
  let expected = await getGeolocations(["78744"]);
  expect(expected).toStrictEqual([
    {
      place: "Austin",
      latitude: 30.1876,
      longitude: -97.7472,
      country: "US",
      weather: expected[0].weather,
    },
  ]);
});

test("Validate weather is returning in correct format", async ({ page }) => {
  let expected = await getGeolocations(["78744"]);
  let expectedWeather = expected[0].weather;
  expect(expectedWeather).toMatchObject({
    place: expect.any(String),
    temperature: expect.any(Number),
    feelsLike: expect.any(Number),
    humidity: expect.any(Number),
    windSpeed: expect.any(Number),
    weatherCondition: expect.any(String),
    country: expect.any(String),
  });
});

test("Validate temperature is returning in Fahrenheit", async ({ page }) => {
  let expected = await getGeolocations(["78744"]);
  const response: AxiosResponse = await axios.get(process.env.BASE_URL!, {
    params: { appid: process.env.API_KEY!, zip: "78744" },
  });
  let expectedTemp = expected[0].weather.temperature;
  let actualTemp = kelvinToFahrenheit(response.data.main.temp);
  expect(expectedTemp).toStrictEqual(actualTemp);
});

test("Get 2 geo locations when you pass Place name and Zip Code together", async ({
  page,
}) => {
  let expected = await getGeolocations(["Chicago, IL", "78744"]);
  expect(expected).toStrictEqual([
    {
      place: "Chicago",
      latitude: 41.85,
      longitude: -87.65,
      country: "US",
      weather: expected[0].weather,
    },
    {
      place: "Austin",
      latitude: 30.1876,
      longitude: -97.7472,
      country: "US",
      weather: expected[1].weather,
    },
  ]);
});

test("You are able to get 2 geo locations when you pass 2 different Zip Codes", async ({
  page,
}) => {
  let expected = await getGeolocations(["78745", "78744"]);
  expect(expected).toStrictEqual([
    {
      place: "Austin",
      latitude: 30.2063,
      longitude: -97.7956,
      country: "US",
      weather: expected[0].weather,
    },
    {
      place: "Austin",
      latitude: 30.1876,
      longitude: -97.7472,
      country: "US",
      weather: expected[1].weather,
    },
  ]);
});

test("You are able to get 2 geo locations when you pass 2 different Place Names", async ({
  page,
}) => {
  let expected = await getGeolocations(["Chicago, IL", "Los Angeles, CA"]);
  expect(expected).toStrictEqual([
    {
      place: "Chicago",
      latitude: 41.85,
      longitude: -87.65,
      country: "US",
      weather: expected[0].weather,
    },
    {
      place: "Los Angeles",
      latitude: 34.0522,
      longitude: -118.2437,
      country: "US",
      weather: expected[1].weather,
    },
  ]);
});

test("Validate error when you pass empty string input", async ({ page }) => {
  let expected = await getGeolocations([""]);
  expect(expected).toStrictEqual([
    'Please pass an input. Invalid input format. Provide a valid city, state (e.g., "Madison, WI") or a valid zip code (e.g., "12345").',
  ]);
});

test("Validate you get only geo location once when you pass duplicates Place Names or Zip Codes", async ({
  page,
}) => {
  let expected = await getGeolocations([
    "Chicago, IL",
    "78744",
    "Chicago, IL",
    "78744",
  ]);
  expect(expected).toStrictEqual([
    {
      place: "Chicago",
      latitude: 41.85,
      longitude: -87.65,
      country: "US",
      weather: expected[0].weather,
    },
    {
      place: "Austin",
      latitude: 30.1876,
      longitude: -97.7472,
      country: "US",
      weather: expected[1].weather,
    },
  ]);
});

test("Validate errors when you pass wrong format Place and Zip Code", async ({
  page,
}) => {
  let expected = await getGeolocations([
    "YYYYY, XXXX, RRR, TTT",
    "5656575478493",
  ]);
  expect(expected).toStrictEqual([
    'YYYYY, XXXX, RRR, TTT: Invalid input format. Please provide a valid city, state (e.g., "Madison, WI") or a valid zip code (e.g., "12345").',
    '5656575478493: Invalid input format. Please provide a valid city, state (e.g., "Madison, WI") or a valid zip code (e.g., "12345").',
  ]);
});

test("Validate error when city is not found!", async ({ page }) => {
  let expected = await getGeolocations(["YYYYY, XXXX"]);
  expect(expected).toStrictEqual(["API Error: 404: city not found"]);
});

test("Validate error when you pass empty input", async ({ page }) => {
  let expected = await getGeolocations([]);
  expect(expected).toStrictEqual([
    'Please pass an input. Invalid input format. Provide a valid city, state (e.g., "Madison, WI") or a valid zip code (e.g., "12345").',
  ]);
});

test("You are able to get only geo locations within US", async ({ page }) => {
  let expected = await getGeolocations([
    "Chicago, IL",
    "Ispir, Turkey",
    "78744",
  ]);
  expect(expected).toStrictEqual([
    {
      place: "Chicago",
      latitude: 41.85,
      longitude: -87.65,
      country: "US",
      weather: expected[0].weather,
    },
    "Ispir, Turkey: TR is different country than US. Please use a place within in US",
    {
      place: "Austin",
      latitude: 30.1876,
      longitude: -97.7472,
      country: "US",
      weather: expected[2].weather,
    },
  ]);
});

test("Validate 'API Error: 401: Invalid API key' error when you pass wrong API_KEY", async ({
  page,
}) => {
  process.env.API_KEY = "LOL";
  let expected = await getGeolocations(["Chicago, IL"]);
  expect(expected[0]).toEqual(
    "API Error: 401: Invalid API key. Please see https://openweathermap.org/faq#error401 for more info."
  );
});

test("Validate 'Invalid URL' error when you pass wrong wrong URL", async ({
  page,
}) => {
  process.env.BASE_URL = "LOL";
  let expected: any = await getGeolocations(["Chicago, IL"]);
  expect(expected[0].message).toContain("Invalid URL");
});
