// Calculates a study suitability percentage from five ratings.
// Each rating uses a scale from 0 (poor) to 5 (excellent).

function studyScore({
    wifiScore,
    noiseScore,
    seatingScore,
    outletScore,
    overallRating
}) {
    const scores = [
        wifiScore,
        noiseScore,
        seatingScore,
        outletScore,
        overallRating
    ];

    let totalScore = 0;

    // Add the five scores together.
    for (let i = 0; i < scores.length; i++) {
        totalScore += scores[i];
    }

    const highestPossibleScore = scores.length * 5;
    const scoreOutOf100 =
        (totalScore / highestPossibleScore) * 100;

    return scoreOutOf100;
}

module.exports = { studyScore };