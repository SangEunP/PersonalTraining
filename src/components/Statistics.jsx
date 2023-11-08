import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'; // Import Recharts components

function Statistics() {
  const [statisticsData, setStatisticsData] = useState([]);

  useEffect(() => {
    fetch('https://traineeapp.azurewebsites.net/gettrainings')
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // Process data to calculate sums by activity
          const groupedData = _.groupBy(data, 'activity');
          const statistics = _.mapValues(groupedData, (activityData) => _.sumBy(activityData, 'duration'));

          // Set the statistics data in state
          setStatisticsData(statistics);
        }
      })
      .catch((error) => console.error('Error fetching data: ', error));
  }, []);

  const statisticsArray = Object.keys(statisticsData).map((activity) => ({
    activity,
    minutes: statisticsData[activity],
  }));

  return (
    <div>
      <h2>Statistics</h2>
      {statisticsArray.length > 0 ? (
        <BarChart width={600} height={400} data={statisticsArray} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="activity" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="minutes" fill="#8884d8" />
        </BarChart>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Statistics;