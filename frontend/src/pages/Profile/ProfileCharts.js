import React from 'react';
import { Bar } from 'react-chartjs-2';

const ProfileCharts = ({ poseData }) => {
  // Extract numerical data from the poseData object
  const data = Object.values(poseData || []);

  // Define options for the chart
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div className="profile-charts-container">
      <h2>Pose Counts</h2>
      <div className="chart">
        <Bar data={{ labels: data.map((_, index) => index), datasets: [{ data }] }} options={options} />
      </div>
    </div>
  );
};

export default ProfileCharts;
