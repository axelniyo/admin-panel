import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { userAPI } from '../services/api';

const UserGraph = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await userAPI.getUserStats();
      
      // Fill in missing days with zero counts
      const last7Days = getLast7Days();
      const statsMap = response.data.reduce((acc, stat) => {
        acc[stat.date] = stat.count;
        return acc;
      }, {});

      const completeStats = last7Days.map(date => ({
        date: formatDate(date),
        count: statsMap[date] || 0
      }));

      setStats(completeStats);
    } catch (error) {
      console.error('Failed to load user statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <div>Loading graph data...</div>;
  }

  return (
    <div className="user-graph">
      <h2>User Registrations (Last 7 Days)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name="Users Created"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGraph;