import React, { useState, useEffect } from 'react';
import api from '../services/api';

const LiveLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [leaderboardRes, statsRes] = await Promise.all([
        api.get('/leaderboard/live'),
        api.get('/leaderboard/stats')
      ]);
      setLeaderboard(leaderboardRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
      {/* Live Leaderboard */}
      <div className="card">
        <h3>🏆 Live Leaderboard</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Rank</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Team</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Stage</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Completed</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Time</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Penalty</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((team, index) => (
                <tr key={team.id} style={{ 
                  backgroundColor: team.is_completed ? '#d4edda' : index % 2 === 0 ? '#f8f9fa' : 'white'
                }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {index + 1}
                    {index === 0 && team.is_completed && ' 👑'}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                    {team.team_name}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {team.current_stage}/6
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {team.stages_completed || 0}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {Math.round(team.effective_time_minutes)}m
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {team.total_penalty_minutes > 0 ? `+${team.total_penalty_minutes}m` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stage Statistics */}
      <div className="card">
        <h3>📊 Stage Stats</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stats.map(stage => (
            <div key={stage.stage_number} style={{ 
              padding: '12px', 
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                Stage {stage.stage_number}: {stage.title}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                {stage.category}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Reached: {stage.teams_reached}</span>
                <span>Completed: {stage.teams_completed}</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '6px', 
                backgroundColor: '#e9ecef',
                borderRadius: '3px',
                marginTop: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${stage.completion_rate || 0}%`,
                  height: '100%',
                  backgroundColor: stage.completion_rate > 70 ? '#28a745' : 
                                 stage.completion_rate > 40 ? '#ffc107' : '#dc3545',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', textAlign: 'center' }}>
                {stage.completion_rate || 0}% completion rate
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveLeaderboard;