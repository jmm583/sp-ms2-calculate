# Calculator Microservice
## Developers
- Jon Marchand
- Clarke Stephens

Built for CS 361 at Oregon State University
Project Group: Microservice Masters

## Description
The Calculator Microservice provides three different calculation operations through HTTP POST endpoint (`/calculate`)
Depending on the operation requested, the microservice can:

- Convert one unit of measurement to another
- Calculate the distance between two latitude/longitude coordinates
- Calculate a study score based on the provided inputs

The client sends a JSON request containing the desired operation and any required values 
The microservice processes the request and returns the operation results in the body of a JSON response

### Technologies Used
- Node.js for runtime
- Express.js for routing, middleware, request/response handling

### Prerequisites
- Node.js
- node packet manager (npm)

### Node Packages:
- convert-units   -- Used for unit conversion operations
- geolib          -- Used for distance calculation between latitude/longitude coordinates for distance operations

## Communication Contract
### Request Data through Fetch API:
Requests are sent using the Fetch API. An example below is provided
Example Fetch(): 

    ```js
        const response = await fetch("http://localhost:3004/calculate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(httpJsonBody)
        });
    ```
Client must send HTTP POST request to the `/calculate` route endpoint
    `POST http://localhost:3004/calculate`
    Request body is a JSON Object

### Unit Conversion Request Body

    ```js
        httpJsonBody = {
            operation: "convert",
            value: valueToConvert,
            unitFrom: unitFrom,
            unitTo: unitTo
        };
    ```
### Distance Calculation Request Body

    ```js
        httpJsonBody = {
            operation: "distance",
            startLatitude: latitude1,
            startLongitude: longitude1,
            endLatitude: latitude2,
            endLongitude: longitude2
        };
    ```
### Study Score Request Body

    ```js
        httpJsonBody = {
            operation: "studyScore",
            wifiScore: wifiScore,
            noiseScore: noiseScore,
            seatingScore: seatingScore,
            outletScore: outletScore,
            overallRating: overallRating
        };
    ```
### Receive Data
Receive data using this format the format below.

    ```js
        const data = await response.json();
    ```
The returned HTTP response contains the method (POST), headers, and JSON response body. 
The client can access the microservice calculation results by parsing the body using `JSON.parse()` passing `data` as the argument. 

Example below showing the retieval of `convertedValue` from the UnitConversionService HTTP response body:

    ```js
    // create a variable to store the parsed information
        const resultConvert = JSON.parse(data.body)

    // access the desired value from the parsed information and save as a variable
        const resultConvertValue = resultConvert.convertedValue
    ```

## UML Sequence Diagram
![UML Sequence Diagram](calculator_microservice/uml/uml_seq_diagram.png "Calculator Microservice UML Sequence Diagram")

## Instructions for Demonstration
1) Open a terminal
2) Navigate to directory /calculator_microservice 
3) Initialize the node server by entering the following terminal commands:

    - npm install
    - npm start

4) Open a second terminal
5) Navigate to the /test_client directory
6) Run the test_client by entering the following command in terminal:

    - node cal_run_program.js

7) Follow the prompts by entering requested

## Microservice Implementation Instructions
1) Format your HTTP request body as a JSON object. The microservice handles 3 operations:

    Operation 1: UNIT CONVERSION -- Operation converts one unit of measurement to another
    -- For a list of packaged units reference: https://github.com/convert-units/convert-units#request-measures--units

    ```js
    const http_req_body = {

        operation: "convert",                           // must remain "convert"
        value: parseFloat(valueToConvert),
        unitFrom: conversionOperation.from,     
        unitTo: conversionOperation.to

    };
    ```
    Operation 2: LATITUDE/LONGITUDE DISTANCE CALCULATION -- Operation calculates the distance between two LATITUDE/LONGITUDE coordinates
                
    ```js
    const http_req_body = {

        operation: "distance",                          // must remain "distance"
        units: "mi"                                     // can be "km", "m", or "m"
        startLatitude: parseFloat(latitude1),
        startLongitude: parseFloat(longitude1),
        endLatitude: parseFloat(latitude2),
        endLongitude: parseFloat(longitude2)

    };
    ```
            
     Operation 3: STUDY/SCORE CALCULATION -- Operation calculates an overall study score using user-provided ratings for study quality, 
     WiFi, noise, seating, outlet availability, and overall experience

    ```js
    const http_req_body = {

        operation: "studyScore",                        // must remain "studyScore"
        studyScore: parseInt(studyScore),
        wifiScore: parseInt(wifiScore),
        noiseScore: parseInt(noiseScore),
        seatingScore: parseInt(seatingScore),
        outletScore: parseInt(outletScore),
        overallRating: parseInt(overallRating)

    };
    ```
2) Send an HTTP POST request to /calculate

    ```js
    const response = await fetch('http://localhost:3004/calculate', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(http_req_body)
    });
    ```

3) Add a response listener to receive the response from the microservice operation

    ```js
    const data = await response.json();
    console.log(data);
    ```

    The `data` variable contains the HTTP response payload returned by the microservice

    Example HTTP response:

        ```js
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: '{"operationPerformed":"distance","meterDist":179611,"kmDist":179.611,"miDist":111.60510120893979}'
        }
        ```
    
## References
- Express.js Router API:
  https://expressjs.com/en/5x/api/router/

- Express.js Middleware Guide:
  https://expressjs.com/en/guide/using-middleware.html

- Express Routing & Architecture:
  https://caffeinecoding.com/better-express-routing-for-nodejs/

- Using the Fetch API:
  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

- Code Fencing for Readme
  https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks 

 - npm convert-units
  https://www.npmjs.com/package/@types/convert-units

 - npm geolib
  https://www.npmjs.com/package/geolib
