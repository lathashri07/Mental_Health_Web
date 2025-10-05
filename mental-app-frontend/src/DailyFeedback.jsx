// src/DailyFeedback.jsx

import React from 'react';

function DailyFeedback({ dayData }) {
  if (!dayData) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Click a bar on the graph to see feedback for a specific day.</p>
      </div>
    );
  }

  const { duration, sleepTime } = dayData;
  let durationFeedback = "";
  let bedtimeFeedback = "";

  // Analyze Duration
  if (duration >= 7 && duration <= 9) {
    durationFeedback = `Your sleep duration of ${duration} hours was in the ideal range. Great job!`;
  } else if (duration < 7) {
    durationFeedback = `Getting ${duration} hours of sleep might be too little. Aim for 7-9 hours to feel fully rested.`;
  } else {
    durationFeedback = `${duration} hours is plenty of sleep. Ensure you feel refreshed upon waking.`;
  }

  // Analyze Bedtime
  const sleepHour = parseInt(sleepTime.split(':')[0], 10);
  if (sleepHour >= 21 && sleepHour <= 23) {
    bedtimeFeedback = `A bedtime of ${sleepTime} is excellent for aligning with your body's natural sleep-wake cycle.`;
  } else {
    bedtimeFeedback = `Your bedtime was ${sleepTime}. Consistency is key, even if it's a little late.`;
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xl font-bold text-center text-gray-800">
        Daily Analysis for {new Date(dayData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </h3>
      <div className="space-y-3 pt-2 text-sm">
        <p className="p-3 bg-blue-50 rounded-lg">🧠 <span className="font-semibold">Duration:</span> {durationFeedback}</p>
        <p className="p-3 bg-green-50 rounded-lg">⏰ <span className="font-semibold">Bedtime:</span> {bedtimeFeedback}</p>
      </div>
    </div>
  );
}

export default DailyFeedback;