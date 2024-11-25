# Receipt Processor - For Fetch Rewards

## Overview

The **Receipt Processor** is a Dockerized web service designed to process receipts and calculate reward points based on predefined rules. It offers two primary API endpoints:

1. **Process Receipts**: Accepts a receipt in JSON format and returns a unique ID for the receipt.
2. **Get Points**: Retrieves the number of points awarded for a given receipt ID.

Data is stored in-memory using a `Map` data structure, ensuring quick access and simplicity without the need for external database configurations. Comprehensive tests are implemented using Jest to ensure functionality and reliability.

## Features

- **API Endpoints**:
  - `POST /receipts/process`: Submit a receipt for processing.
  - `GET /receipts/{id}/points`: Retrieve points awarded for a specific receipt.

- **Point Calculation Rules**:
  - One point for every alphanumeric character in the retailer name.
  - 50 points if the total is a round dollar amount with no cents.
  - 25 points if the total is a multiple of `0.25`.
  - 5 points for every two items on the receipt.
  - If the trimmed length of the item description is a multiple of 3, multiply the price by `0.2` and round up to the nearest integer. The result is the number of points earned.
  - 6 points if the day in the purchase date is odd.
  - 10 points if the time of purchase is after 2:00pm and before 4:00pm.

## Getting Started

### Prerequisites

- **Docker**: Ensure Docker is installed on your Macbook Pro M1 Max running macOS 15.1.
- **Docker Compose**: Included with Docker Desktop or install separately.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone <your-repository-url>
   cd <your-repository-directory>
   ```

2. **Build and Start the Application**:
   ```bash
   make build
   make run
   ```
   
   Or to build and run simultaneously:
   ```bash
   make start
   ```

   These commands will:
   - Build the Docker image based on the provided `Dockerfile`.
   - Start the application using Docker Compose as defined in `docker-compose.yml`.
   - The server will be accessible at `http://localhost:8080`.

### Running Tests

The application includes comprehensive tests to ensure functionality and reliability.

1. **Run Tests**:
   ```bash
   make test
   ```

   This command will execute the test suite using Jest, providing detailed output on test results within the Docker container, printed to your terminal. This command will also start the application in test mode.


### Example Requests

#### Process Receipt

**Endpoint**: `POST /receipts/process`

**Request Body**:
```json
{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    },
    {
      "shortDescription": "Emils Cheese Pizza",
      "price": "12.25"
    }
  ],
  "total": "18.74"
}
```

**Response**:
```json
{
  "id": "7fb1377b-b223-49d9-a31a-5a02701dd310"
}
```

#### Get Points

**Endpoint**: `GET /receipts/{id}/points`

**Response**:
```json
{
  "points": 32
}
```

## Project Structure

```plaintext
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md
├── src
│   ├── entry.ts
│   ├── __tests__
│   │   └── server.test.ts
│   ├── _common
│   │   ├── exceptions
│   │   │   └── UserPresentableError.ts
│   │   └── helpers.ts
│   └── models
│       └── receipts
│           ├── _helpers
│           │   ├── extraction.ts
│           │   ├── sanitization.ts
│           │   ├── validation.ts
│           │   └── pointsCalculator.ts
│           ├── _types
│           │   └── Receipt.ts
│           ├── model.ts
│           └── points
│               └── model.ts
└── examples
    ├── morning-receipt.json
    └── simple-receipt.json
```

## Detailed Instructions

### Building the Application

The `Makefile` provides convenient commands to build and run the application using Docker Compose.

- **Build the Docker Image**:
  ```bash
  make build
  ```

- **Run the Application**:
  ```bash
  make run
  ```

- **Start the Application (Build and Run)**:
  ```bash
  make start
  ```

- **Run Tests**:
  ```bash
  make test
  ```

- **Rebuild**:
  We do not build every time we run. To ensure package changes make it through, we can rebuild.

  ```bash
  make rebuild
  ```

### Environment Configuration

The application uses environment variables for configuration. These are defined in the `docker-compose.yml` file:

```yaml
environment:
  - PORT=8080 # the port the server will listen on
  - NODE_ENV=development # or production - this will affect error handling
  - PERSISTENCE=true # set to false to disable data persistence
```

### Data Persistence

Data is stored in-memory using a `Map`. Although there is a `data.json` file (`src/_demo/data.json`) for demonstration purposes, the README specifies that data does not need to persist when the application stops. This allows for the use of in-memory storage solutions during testing and deployment. This can be disabled by setting `PERSISTENCE=false` in the `docker-compose.yml` file.

## Testing

The project utilizes Jest for testing, with test files located in the `src/__tests__` directory. Tests cover various scenarios, including:

- **Health Check**: Ensures the `/ping` endpoint is responsive.
- **Receipt Retrieval**: Validates retrieval of receipts by ID.
- **Points Calculation**: Checks the accuracy of points awarded based on receipt data.
- **Error Handling**: Ensures proper responses are returned for invalid inputs and server errors.

### Running Tests

To execute the test suite, use the following command:

```bash
make test
```

This will run all tests and provide a summary of the results.

## Contact

For any questions or feedback, please reach out to the applicant at [hi@karlschmidt.me](mailto:hi@karlschmidt.me).
