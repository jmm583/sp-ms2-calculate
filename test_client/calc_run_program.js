// UNIT CONVERSION OPERATION TEST
async function testUnitConversion() {

    const http_req_body = {
        operation: "convert",
		value: 5,
		unitFrom: "m",
		unitTo: "ft"
    };
    console.log("UNIT CONVERT OP REQUEST BODY: ", http_req_body);


    const response = await fetch('http://localhost:3004/calculate', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(http_req_body)
                });

    const data = await response.json();
    console.log("\nUNIT CONVERT OP HTTP RESPONSE: ", data);

};

// DISTANCE OPERATION TEST
async function testDistance() {

    const http_req_body = {
        operation: "distance", 
        units: "",
        startLatitude: 40.7128,
        startLongitude: -74.0060,
        endLatitude: 42.3601,
        endLongitude: -71.0589
	};
    console.log("DIST OP REQUEST BODY: ", http_req_body);

    const response = await fetch('http://localhost:3004/calculate', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(http_req_body)
                });

    const data = await response.json();
    console.log("\nDIST OP HTTP RESPONSE: ", data.body);
};

// STUDY SCORE OPERATION TEST
async function testStudyScore() {

    const http_req_body = {
        operation: "studyScore",
        wifiScore: 4,
        noiseScore: 3,
        seatingScore: 5,
        outletScore: 5,
        overallRating: 4
    };
    console.log("STUDY SCORE OP REQUEST BODY: ", http_req_body);


    const response = await fetch('http://localhost:3004/calculate', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(http_req_body)
                });

    const data = await response.json();
    console.log("\nSTUDY SCORE HTTP RESPONSE: ", data);

};

// testUnitConversion()
// testDistance()
testStudyScore()