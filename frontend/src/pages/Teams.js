import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTeam, setEditingTeam] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    setError(''); // Clear any existing errors
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/teams');
      console.log('Teams response:', response.data);
      setTeams(response.data || []);
      // Success - clear error and set teams
      setError('');
      console.log('Teams loaded successfully:', response.data.length, 'teams');
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to load teams. Please try again.');
      setTeams([]); // Clear teams on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/teams', formData);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      fetchTeams();
    } catch (error) {
      setError('Failed to create team');
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/teams/${editingTeam.id}`, formData);
      setEditingTeam(null);
      setFormData({ name: '', description: '' });
      fetchTeams();
    } catch (error) {
      setError('Failed to update team');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await api.delete(`/api/teams/${teamId}`);
        fetchTeams();
      } catch (error) {
        setError('Failed to delete team');
      }
    }
  };

  const startEdit = (team) => {
    setEditingTeam(team);
    setFormData({ name: team.name, description: team.description || '' });
  };

  if (loading) {
    return (
      <div className="container">
        <LoadingSpinner size="large" text="Loading teams..." />
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="welcome-title" style={{ fontSize: '2.5rem', marginBottom: '40px' }}>
        👥 Teams Dashboard
      </h1>
      
      {error && (
        <div className="error-message" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ {error}</span>
          <button 
            onClick={() => setError('')}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="card fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '1.8rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🏆 All Teams ({teams.length})
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              ➕ Add Team
            </button>
            <button 
              onClick={() => {
                setError('');
                fetchTeams();
              }}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        
        {/* Create/Edit Form */}
        {(showCreateForm || editingTeam) && (
          <div className="card" style={{ marginBottom: '30px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)' }}>
            <h3>{editingTeam ? '✏️ Edit Team' : '➕ Create New Team'}</h3>
            <form onSubmit={editingTeam ? handleUpdateTeam : handleCreateTeam}>
              <div className="form-group">
                <label>Team Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Enter team name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter team description"
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingTeam ? '💾 Update' : '✅ Create'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTeam(null);
                    setFormData({ name: '', description: '' });
                  }}
                  className="btn"
                  style={{ background: '#e2e8f0', color: '#4a5568' }}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {teams.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: '12px',
            border: '2px dashed rgba(102, 126, 234, 0.2)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👥</div>
            <h3 style={{ color: '#4a5568', marginBottom: '12px' }}>No Teams Found</h3>
            <p style={{ color: '#718096' }}>Teams will appear here once they are created.</p>
          </div>
        ) : (
          <div className="team-list">
            {teams.map((team, index) => (
              <div 
                key={team.id} 
                className="card hover-lift fade-in" 
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
                  border: '1px solid rgba(102, 126, 234, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 style={{ 
                    color: '#4a5568', 
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    margin: '0'
                  }}>
                    🛡️ {team.name}
                  </h3>
                  <span style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    #{team.id}
                  </span>
                </div>
                
                {team.description && (
                  <p style={{ color: '#718096', marginBottom: '16px', fontStyle: 'italic' }}>
                    "{team.description}"
                  </p>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '16px',
                    flex: 1
                  }}>
                    <div style={{ 
                      background: 'rgba(102, 126, 234, 0.1)', 
                      padding: '12px', 
                      borderRadius: '8px' 
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#667eea' }}>
                        👤 {team.created_by_name || 'Unknown'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Team Leader
                      </div>
                    </div>
                    
                    <div style={{ 
                      background: 'rgba(67, 233, 123, 0.1)', 
                      padding: '12px', 
                      borderRadius: '8px' 
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#43e97b' }}>
                        👥 {team.member_count || 0}
                      </div>
                      <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Members
                      </div>
                    </div>
                    
                    <div style={{ 
                      background: 'rgba(245, 101, 101, 0.1)', 
                      padding: '12px', 
                      borderRadius: '8px' 
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f56565' }}>
                        📅 {new Date(team.created_at).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Created
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                    <button 
                      onClick={() => startEdit(team)}
                      className="btn"
                      style={{ 
                        background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                        color: 'white',
                        padding: '8px 12px',
                        fontSize: '12px'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteTeam(team.id)}
                      className="btn"
                      style={{ 
                        background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                        color: 'white',
                        padding: '8px 12px',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;