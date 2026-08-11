const unitConversionService = require("../services/UnitConversionService");
const distanceService = require("../services/DistanceService");
const studyScoreService = require("../services/StudyScoreService");


async function calculate(req, res) {

    const serviceOperation = req.body.operation;

    switch (serviceOperation) {

        // CALL CONVERT SERVICE FUNCTIONS
        case "convert": {
            console.log("CONVERT OP REQUESTED");
            console.log("HTTP REQUEST BODY: ", req.body)

            const convertedUnitValue = unitConversionService.convertUnits(
                req.body.value, 
                req.body.unitFrom, 
                req.body.unitTo
            );
            console.log(convertedUnitValue);

            httpResBody = {
                operationPerformed: req.body.operation,
                unitFrom: req.body.unitFrom,
                unitTo: req.body.unitTo,
                convertedValue: convertedUnitValue
            };
            console.log("CONVERT OP HTTP POST RESPONSE BODY", httpResBody);

            res.json({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(httpResBody)
            })

            break;
        };

        // CALL DISTANCE SERVICE FUNCTIONS 
        case "distance": {

            console.log("DISTANCE OP REQUESTED")
            console.log("HTTP REQUEST BODY: ", req.body)

            const startLat = req.body.startLatitude,
                startLon = req.body.startLongitude,
                endLat = req.body.endLatitude,
                endLon = req.body.endLongitude;

            // functional requirement 2nd user story
            // lat must be between -90 and 90, lon must be between -180 and 180
            if (startLat < -90 || startLat > 90 ||
                startLon < -180 || startLon > 180 ||
                endLat < -90 || endLat > 90  ||
                endLon < -180 || endLon > 180) {

                return res.status(400).json({
                    error: "Invalid coordinates",
                    message: "Latitude coordinate must be between -90 and 90\nLongitude must be between -180 and 180"
                })
            }

            const meterDist = distanceService.meterDistance(
                { latitude: req.body.startLatitude, longitude: req.body.startLongitude },
                { latitude: req.body.endLatitude, longitude: req.body.endLongitude }
            );

            const kmDist = distanceService.kmDistance(meterDist);
            const miDist = distanceService.mileDistance(meterDist);
            
            let httpResBody;

            // User story 2 function requirements
            // default to miles if unit key value is left empty from request body
            if (req.body.units == "km") {
                httpResBody = {
                    operationPerformed: req.body.operation,
                    kmDist: kmDist
                }
                console.log("HTTP RESPONSE BODY: ", httpResBody);

            } else if (req.body.units == "mi") {
                httpResBody = {
                    operationPerformed: req.body.operation,
                    miDist: miDist
                }
                console.log("HTTP RESPONSE BODY: ", httpResBody);

            } else if (req.body.units == "m") {

                httpResBody = {
                    operationPerformed: req.body.operation,
                    meterDist: meterDist,
                }
                console.log("HTTP RESPONSE BODY: ", httpResBody);

            } else if (req.body.units == "" || req.body.units === undefined) {

                httpResBody = {
                    operationPerformed: req.body.operation,
                    miDist: miDist
                }

            } else {
                return res.status(400).json({
                    error: "Invalid unit requested",
                    message: "Units must be km, m, or mi. An empty string is defaulted to mi"
                })
            }
            
            console.log("HTTP RESPONSE BODY: ", httpResBody);
            
            res.json({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(httpResBody)
            });

        break;
    };

        // CALL STUDY SCORE SERVICE FUNCTIONS
        case "studyScore": {

        console.log("STUDY SCORE OP REQUESTED")
        console.log("HTTP REQUEST BODY: ", req.body)

        const studyScore = studyScoreService.studyScore(
            req.body.wifiScore, req.body.noiseScore,
            req.body.seatingScore, req.body.outletScore,
            req.body.overallRating
        );

        const httpResBody = {
            operationPerformed: req.body.operation,
            studyScore: studyScore
        };
        console.log("STUDY SCORE OP HTTP RES BODY", httpResBody);


        res.json({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(httpResBody)
        });

        break;
        };
    }
}


module.exports = { calculate };