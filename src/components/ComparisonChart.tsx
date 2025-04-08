
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlgorithmResult } from '../utils/types';

interface ComparisonChartProps {
  results: AlgorithmResult[];
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return <div className="text-center p-4">No data to display</div>;
  }

  // Prepare data for execution time chart
  const executionTimeData = results.map((result) => ({
    name: result.name,
    time: result.executionTime,
    color: result.color,
  }));

  // Prepare data for tour completeness chart
  const successData = results.map((result) => ({
    name: result.name,
    steps: result.path.length,
    complete: result.success ? 1 : 0,
    color: result.color,
  }));

  return (
    <div className="space-y-8 w-full">
      <div>
        <h3 className="text-lg font-semibold mb-4">Execution Time Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={executionTimeData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)} ms`, 'Execution Time']}
            />
            <Legend />
            <Bar 
              dataKey="time" 
              name="Execution Time (ms)" 
              fill="#8884d8" 
              radius={[4, 4, 0, 0]}
              isAnimationActive={true} 
            >
              {executionTimeData.map((entry, index) => (
                <Bar key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Steps Completed</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={successData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{ value: 'Steps', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [value, name]}
            />
            <Legend />
            <Bar 
              dataKey="steps" 
              name="Steps Completed" 
              fill="#82ca9d"
              radius={[4, 4, 0, 0]} 
            >
              {successData.map((entry, index) => (
                <Bar key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;
