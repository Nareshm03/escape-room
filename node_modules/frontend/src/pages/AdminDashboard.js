import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/admin/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      
      <div className="card">
        <h2>Teams</h2>
        {teams.length === 0 ? (
          <p>No teams found</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(team => (
                <tr key={team.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{team.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{team.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{team.description}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {new Date(team.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;