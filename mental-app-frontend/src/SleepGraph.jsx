// src/SleepGraph.jsx

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SleepGraph({ sleepData = [], selectedDate, onDateSelect }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (sleepData.length > 0) {
      const labels = sleepData.map(entry => new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      const dataPoints = sleepData.map(entry => entry.duration);
      
      // ✅ Dynamically color the selected bar
      const backgroundColors = sleepData.map(entry =>
        entry.date === selectedDate
          ? 'rgba(239, 68, 68, 0.7)' // Highlight color (red)
          : 'rgba(59, 130, 246, 0.5)' // Default color (blue)
      );

      setChartData({
        labels,
        datasets: [{
          label: 'Hours Slept',
          data: dataPoints,
          backgroundColor: backgroundColors,
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        }],
      });
    } else {
      setChartData(null);
    }
  }, [sleepData, selectedDate]);

  const options = {
    responsive: true,
    plugins: { /* ... */ },
    scales: { /* ... */ },
    // ✅ Handle clicks on the graph bars
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedElementIndex = elements[0].index;
        const clickedDate = sleepData[clickedElementIndex].date;
        onDateSelect(clickedDate);
      }
    },
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Your Sleep History</h3>
      {chartData ? <Bar options={options} data={chartData} /> : <p className="text-center text-gray-500 pt-10">Log your sleep to build your history.</p>}
    </div>
  );
}

export default SleepGraph;