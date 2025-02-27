# Geolocation Utility

This utility fetches geolocation data (latitude, longitude, place name, and Weather) from the OpenWeather Geocoding API based on city, state, or zip code inputs.

## Requirements

- Node.js / NPM
- TypeScript
- `axios` and `commander` packages (installed via `npm install`)
- Playwright: Integration test tool for API and UI
- API_KEY for openweathermap and add to .env file please

## Install dependencies

- npm install

## Running the Utility

You can run the utility via the command line like this:

```bash
npm run geoloc-util "Chicago, IL"
npm run geoloc-util --  "Madison, WI" "10001" "Chicago, IL"

Running


## Running the Tests

You can run the utility Integration Test with below command:
npm test

You will get HTML report and open with
npx playwright show-report

```
