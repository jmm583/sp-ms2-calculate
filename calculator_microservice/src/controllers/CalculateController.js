const unitConversionService = require("../services/UnitConversionService");
const distanceService = require("../services/DistanceService");
const studyScoreService = require("../services/StudyScoreService");


async function calculate(req, res) {

    const serviceOperation = req.body.operation;

    switch (serviceOperation) {

        case "convert":
            return processConvert(req, res);

        case "distance":
            return processDistance(req, res);

        case "studyScore":
            return processStudyScore(req, res);

        default:
            return res.status(400).json({
                error: "Invalid operation",
                message: "Operation must be convert, distance, or studyScore"
            });
    }
}


//====================================
// UNIT CONVERSION OPERATION FUNCTION
//====================================
function processConvert(req, res) {

    console.log("CONVERT OP REQUESTED");
    console.log("HTTP REQUEST BODY: ", req.body);

    const convertedUnitValue = unitConversionService.convertUnits(
        req.body.value,
        req.body.unitFrom,
        req.body.unitTo
    );

    const httpResBody = {
        operationPerformed: req.body.operation,
        unitFrom: req.body.unitFrom,
        unitTo: req.body.unitTo,
        convertedValue: convertedUnitValue
    };

    console.log("CONVERT OP HTTP POST RESPONSE BODY", httpResBody);

    sendResponse(res, httpResBody);
}


//==============================
// DISTANCE OPERATION FUNCTION
//==============================
function processDistance(req, res) {

    console.log("DISTANCE OP REQUESTED");
    console.log("HTTP REQUEST BODY: ", req.body);

    const coordinates = getCoordinates(req);

    // call validate coordinates helper function on req body coordinates
    if (!validateCoordinates(coordinates)) {
        return res.status(400).json({
            error: "Invalid coordinates",
            message: "Latitude coordinate must be between -90 and 90\nLongitude must be between -180 and 180"
        });
    }

    const distances = calculateDistances(coordinates);

    // call createDistanceResp helper function. Determines the correct unit to send back to client.
    const httpResBody = createDistanceResp(
        req.body.operation,
        req.body.units,
        distances
    );

    if (httpResBody.error) {
        return res.status(400).json(httpResBody);
    }

    console.log("HTTP RESPONSE BODY: ", httpResBody);

    sendResponse(res, httpResBody);
}


//=================================
// STUDY SCORE OPERATION FUNCTION
//=================================
function processStudyScore(req, res) {

    console.log("STUDY SCORE OP REQUESTED");
    console.log("HTTP REQUEST BODY: ", req.body);

    const studyScore = studyScoreService.studyScore({
        wifiScore: req.body.wifiScore,
        noiseScore: req.body.noiseScore,
        seatingScore: req.body.seatingScore,
        outletScore: req.body.outletScore,
        overallRating: req.body.overallRating
    });

    const httpResBody = {
        operationPerformed: req.body.operation,
        studyScore: studyScore
    };

    console.log("STUDY SCORE OP HTTP RES BODY", httpResBody);

    sendResponse(res, httpResBody);
}


//==============================
// Universal Response Function
//==============================
function sendResponse(res, httpResBody) {
    res.json({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(httpResBody)
    });
}


//========================================
// HELPER FUNCTIONS for PROCESS DISTANCE   
//========================================

// Get coordinates from client request body
function getCoordinates(req) {

    const coordinates = {
        start: {
            latitude: req.body.startLatitude,
            longitude: req.body.startLongitude
        },
        end: {
            latitude: req.body.endLatitude,
            longitude: req.body.endLongitude
        }
    };

    return coordinates;
}


// Validate Coordinates returned by getCoordinates()
// if boolean false is returned processDistance instantly sends 400 response
function validateCoordinates(coordinates) {

    const startLat = coordinates.start.latitude;
    const startLon = coordinates.start.longitude;
    const endLat = coordinates.end.latitude;
    const endLon = coordinates.end.longitude;

    // returns true if all conditions are met

    if (
        startLat >= -90 && startLat <= 90 &&
        startLon >= -180 && startLon <= 180 &&
        endLat >= -90 && endLat <= 90 &&
        endLon >= -180 && endLon <= 180
    ) {
        return true;
    } else {
        return false;
    }
};


// Calculate Distance by calling functions from DistanceService.js
function calculateDistances(coordinates) {

    const meterDist = distanceService.meterDistance(
        coordinates.start,
        coordinates.end
    );

    return {
        meterDist: meterDist,
        kmDist: distanceService.kmDistance(meterDist),
        miDist: distanceService.mileDistance(meterDist)
    };
}

// Switch statement for requested distance unit
function createDistanceResp(operation, units, distances) {

    switch (units) {

        case "km":
            return {
                operationPerformed: operation,
                kmDist: distances.kmDist
            };

        case "mi":
            return {
                operationPerformed: operation,
                miDist: distances.miDist
            };

        case "m":
            return {
                operationPerformed: operation,
                meterDist: distances.meterDist
            };

        case "":
        case undefined:
            return {
                operationPerformed: operation,
                miDist: distances.miDist
            };

        default:
            return null;
    }
};

module.exports = { calculate };