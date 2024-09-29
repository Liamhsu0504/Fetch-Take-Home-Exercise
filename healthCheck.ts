import * as fs from "fs";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as yaml from "js-yaml";

const INTERVAL_MS: number = 15000; // set the program checking each url 15 seconds

// define the interface for endpoint
interface Endpoint {
  name: string;
  url: string;
  method?: string; // optional
  headers?: Record<string, string>; // optional
  body?: string; // optional
}

// define domain result interface
interface DomainResult {
  up: number;
  total: number;
}

// define result interface
interface Results {
  [domain: string]: DomainResult;
}

let results: Results = {};

// This function is for calculating availability percentage
function calculateAvailability(domain: string): number {
  const domainData = results[domain];
  const availability = (domainData.up / domainData.total) * 100;
  return Math.round(availability); //round to the nearest whole percentage
}

// This function is to perform the health check
async function checkEndpoint(endpoint: Endpoint): Promise<"UP" | "DOWN"> {
  if (!endpoint.name || !endpoint.url) {
    throw new Error(
      `Invalid endpoint configuration: name and url are required`
    );
  }
  const options: AxiosRequestConfig = {
    method: endpoint.method || "GET", // set the method as GET if an endpoint's method is empty
    url: endpoint.url,
    headers: endpoint.headers || {},
  };

  if (endpoint.body) {
    options.data = JSON.parse(endpoint.body);
  }

  try {
    const startTime = new Date().getTime();
    const response: AxiosResponse = await axios(options); // get the respond from URL
    const endTime = new Date().getTime();
    const latency = endTime - startTime; // calculate the latency

    if (response.status >= 200 && response.status < 300 && latency < 500) {
      return "UP";
    }
  } catch (error) {
    console.log(`${endpoint.name}: Error`);
  }
  return "DOWN";
}

// This function is for handling YAML file input and perform health checks
function startHealthCheck(configFilePath: string): void {
  const file = fs.readFileSync(configFilePath, "utf8"); // read the yaml file
  const endpoints: Endpoint[] = yaml.load(file) as Endpoint[];

  setInterval(async () => {
    for (const endpoint of endpoints) { // go through all the endpoints in YAML
      const domain = new URL(endpoint.url).hostname;
      if (!results[domain]) {
        results[domain] = { up: 0, total: 0 };
      }

      const status = await checkEndpoint(endpoint); // check the url's health

      results[domain].total += 1; 

      if (status === "UP") {
        results[domain].up += 1;
      }
      // Log the availability percentage of the domain
      console.log(
        `${domain} has ${calculateAvailability(
          domain
        )}% availability percentage`
      );
    }
  }, INTERVAL_MS);
}

// This function is to exit the program
function exit() {
  console.log("\nShutting down...");
  process.exit(0);
}

// Set up CTRL+C to exit program
process.on("SIGINT", exit);

// Ensure the program is given the correct input arguments
if (process.argv.length !== 3) {
  console.error("Usage: ts-node healthCheck.ts <config-file-path>");
  process.exit(1);
}
const configFilePath = process.argv[2];

// program starts here
startHealthCheck(configFilePath);
