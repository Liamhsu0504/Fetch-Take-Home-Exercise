# Fetch-Take-Home-Exercise

This is a TypeScript program that performs health checks on a set of HTTP endpoints specified in a YAML configuration file. It periodically checks the health of each endpoint and logs the availability percentage for each domain.

## Features

- Reads endpoint configurations from a YAML file
- Performs health checks every 15 seconds
- Supports custom HTTP methods, headers, and body for each endpoint
- Calculates and logs availability percentages for each domain
- Rounds availability percentages to the nearest whole number
- Graceful shutdown with CTRL+C

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v12 or later)
- npm (usually comes with Node.js)

## Installation

1. Clone this repository or download the source code.
2. Navigate to the project directory.
3. Install the required dependencies:

```
npm install
```

## Usage

1. Create a YAML configuration file with your endpoints. For example, `endpoints.yaml`:

```yaml
- headers:
    user-agent: fetch-synthetic-monitor
  method: GET
  name: fetch index page
  url: https://fetch.com/

- headers:
    user-agent: fetch-synthetic-monitor
  method: GET
  name: fetch careers page
  url: https://fetch.com/careers

- body: '{"foo":"bar"}'
  headers:
    content-type: application/json
    user-agent: fetch-synthetic-monitor
  method: POST
  name: fetch some fake post endpoint
  url: https://fetch.com/some/post/endpoint

- name: fetch rewards index page
  url: https://www.fetchrewards.com/

```

2. Run the program with the path to your YAML file:

```
npx ts-node healthCheck.ts path/to/your/endpoints.yaml
```

3. The program will start checking the endpoints every 15 seconds and log the availability percentages.

4. To stop the program, press CTRL+C.

## Configuration File Format

The YAML configuration file should contain a list of endpoints, each with the following properties:

- `name` (required): A descriptive name for the endpoint
- `url` (required): The URL of the endpoint
- `method` (optional): The HTTP method to use (defaults to GET)
- `headers` (optional): A dictionary of HTTP headers to include
- `body` (optional): A JSON-encoded string to send as the request body

## Output

The program will log the availability percentage for each domain after each check cycle. For example:

```
fetch.com has 100% availability percentage

```

When you stop the program with CTRL+C, it will print "Shutting down..." and exit.


## Contact
lhsu16@asu.edu