import { Command } from "commander";
import { getGeolocations } from "./src/utilities/getGeolocations";

const program = new Command();

program
  .version("1.0.0")
  .description("Geolocation Utility")
  .argument("<locations...>", "List of locations (City, State or Zip Code)")
  .action(async (locations: string[]) => {
    await getGeolocations(locations);
  });

program.parse(process.argv);
