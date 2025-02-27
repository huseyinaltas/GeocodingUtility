# Geolocation Utility

This utility fetches geolocation data (latitude, longitude, place name, and weather) from the OpenWeather Geocoding API based on city, state, or zip code inputs.

## Requirements

- Node.js / NPM
- TypeScript
- `axios` and `commander` packages (being installed via `npm install`)
- Playwright: Integration test tool for API and UI (being installed via `npm install`)
- API_KEY for openweathermap and add to .env file please

## Install dependencies

- npm install
- npx playwright install

## Running the Utility

You can run the utility via the command line like this:

```bash
npm run geoloc-util "Chicago, IL"
npm run geoloc-util --  "Madison, WI" "10001" "Chicago, IL"
```

## Running the Tests

You can run the utility Integration Test with below command:
```bash
npm test
```

You will get HTML report and open with
```bash
npx playwright show-report
```

