// src/WeeklyFeedback.jsx

import React, { useMemo } from 'react';

// Helper function to calculate the standard deviation for consistency
const getStandardDeviation = (array) => {
  if (array.length < 2) return 0;
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
};

// Helper function to convert "HH:MM" time to a numerical value in hours
const timeToHours = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
};

function WeeklyFeedback({ weekData = [] }) {
    
    const analysis = useMemo(() => {
        if (weekData.length < 7) {
            return {
                score: 0,
                durationFeedback: "Keep logging your sleep to get your weekly score!",
                consistencyFeedback: ""
            };
        }
        
        // DURATION ANALYSIS (60 points)
        const durations = weekData.map(d => d.duration);
        const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        let durationScore = 0;
        let durationFeedback = "";

        if (avgDuration >= 7 && avgDuration <= 9) {
            durationScore = 60;
            durationFeedback = `Excellent! Your average sleep of ${avgDuration.toFixed(1)} hours is in the ideal range (7-9 hours).`;
        } else if (avgDuration >= 6 && avgDuration < 7) {
            durationScore = 40;
            durationFeedback = `You're close! Your average sleep is ${avgDuration.toFixed(1)} hours. Aiming for a little more could boost your energy.`;
        } else {
            durationScore = 20;
            durationFeedback = `Your average sleep is ${avgDuration.toFixed(1)} hours. Prioritizing more sleep could improve your well-being.`;
        }

        // CONSISTENCY ANALYSIS (40 points)
        const bedtimesInHours = weekData.map(d => {
            const time = timeToHours(d.sleepTime);
            return time < 12 ? time + 24 : time;
        });
        const bedtimeStdDev = getStandardDeviation(bedtimesInHours);
        let consistencyScore = 0;
        let consistencyFeedback = "";

        if (bedtimeStdDev <= 0.5) {
            consistencyScore = 40;
            consistencyFeedback = "Amazing consistency! Your regular bedtime helps regulate your body's internal clock.";
        } else if (bedtimeStdDev <= 1) {
            consistencyScore = 25;
            consistencyFeedback = "Good job on consistency. Try to narrow your bedtime window even further for the best results.";
        } else {
            consistencyScore = 10;
            consistencyFeedback = "Your bedtimes vary. A more consistent schedule, even on weekends, can improve sleep quality.";
        }

        // ✅ FIX: totalScore calculation is now correctly inside the hook
        const totalScore = Math.round(durationScore + consistencyScore);
        
        return { score: totalScore, durationFeedback, consistencyFeedback };

    }, [weekData]);

    // The JSX to display the analysis
    return (
        <div className="p-4 space-y-4">
            <h3 className="text-xl font-bold text-center text-blue-700">🏆 Your 7-Day Sleep Score</h3>
            <div className="flex items-center justify-center gap-4">
                <div className="text-5xl font-bold text-blue-600">{analysis.score}</div>
                <div className="text-xl font-semibold text-gray-700">/ 100 <br/> Sleep Score</div>
            </div>
            <div className="space-y-3 pt-2 text-sm">
                {analysis.durationFeedback && <p className="p-3 bg-blue-50 rounded-lg">🧠 <span className="font-semibold">Duration:</span> {analysis.durationFeedback}</p>}
                {analysis.consistencyFeedback && <p className="p-3 bg-green-50 rounded-lg">🔄 <span className="font-semibold">Consistency:</span> {analysis.consistencyFeedback}</p>}
            </div>
        </div>
    );
}

// ✅ FIX: Removed the erroneous line from here
export default WeeklyFeedback;