import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTeams: 0,
    activeGames: 0,
    completedQuizzes: 0,
    averageScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRealStats();
  }, []);

  const fetchRealStats = async () => {
    try {
      setIsLoading(true);
      
      // Get real stats from API
      const [teamsRes, submissionsRes, quizzesRes] = await Promise.all([
        api.get('/api/teams'),
        api.get('/api/leaderboard'),
        api.get('/api/quiz')
      ]);
      
      const teams = teamsRes.data || [];
      const submissions = submissionsRes.data || [];
      const quizzes = quizzesRes.data || [];
      
      // Calculate average score
      const avgScore = submissions.length > 0 
        ? Math.round(submissions.reduce((sum, sub) => sum + (sub.percentage || 0), 0) / submissions.length)
        : 0;
      
      setStats({
        totalTeams: teams.length,
        activeGames: quizzes.filter(q => q.is_published).length,
        completedQuizzes: submissions.length,
        averageScore: avgScore
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set to zero for fresh startup
      setStats({
        totalTeams: 0,
        activeGames: 0,
        completedQuizzes: 0,
        averageScore: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { to: '/teams', icon: '👥', title: 'Manage Teams', desc: 'Create and organize your escape room teams', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { to: '/game', icon: '🎮', title: 'Play Game', desc: 'Start your escape room adventure', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { to: '/results', icon: '📊', title: 'View Results', desc: 'Check performance and statistics', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { to: '/live', icon: '🔴', title: 'Live Board', desc: 'Real-time leaderboard updates', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
  ];

  const adminActions = [
    { to: '/admin', icon: '⚡', title: 'Admin Panel', desc: 'System administration', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { to: '/quiz-creator', icon: '➕', title: 'Create Quiz', desc: 'Design new challenges', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { to: '/quiz-list', icon: '📋', title: 'Quiz List', desc: 'Manage all quizzes', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { to: '/settings', icon: '⚙️', title: 'Settings', desc: 'Configure system settings', color: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)' }
  ];

  const StatCard = ({ icon, title, value, subtitle, delay, color = '#667eea', gradient }) => (
    <div 
      className="dashboard-card bounce-in" 
      style={{ 
        animationDelay: `${delay}s`,
        background: `linear-gradient(135deg, ${gradient[0]}15, ${gradient[1]}15)`,
        borderLeft: `4px solid ${color}`
      }}
    >
      <div style={{ 
        fontSize: '3rem', 
        marginBottom: '16px',
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
        animation: 'float 3s ease-in-out infinite'
      }}>{icon}</div>
      <h3 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '800', 
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '8px',
        lineHeight: '1.1'
      }}>
        {isLoading ? <div className="loading"></div> : value}
      </h3>
      <h4 style={{ color: '#475569', fontWeight: '600', marginBottom: '4px', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h4>
      <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.4' }}>{subtitle}</p>
    </div>
  );

  const ActionCard = ({ to, icon, title, desc, color, delay }) => (
    <Link 
      to={to} 
      className="scale-in" 
      style={{ 
        background: color,
        animationDelay: `${delay}s`,
        textDecoration: 'none',
        display: 'block',
        padding: '28px',
        borderRadius: '20px',
        color: 'white',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-8px) scale(1.05)';
        e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
        e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
      }}
    >
      <div style={{ 
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '100px',
        height: '100px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 4s ease-in-out infinite'
      }}></div>
      <div style={{ fontSize: '2.2rem', marginBottom: '16px', position: 'relative', zIndex: 1 }}>{icon}</div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', position: 'relative', zIndex: 1 }}>{title}</h3>
      <p style={{ fontSize: '14px', opacity: '0.9', margin: '0', lineHeight: '1.5', position: 'relative', zIndex: 1 }}>{desc}</p>
    </Link>
  );

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="slide-in-left" style={{ textAlign: 'center', marginBottom: '48px', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #667eea20, #f093fb20)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          zIndex: -1
        }}></div>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea, #f093fb, #4facfe)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '16px',
          lineHeight: '1.2',
          animation: 'slideInUp 0.8s ease-out'
        }}>
          Welcome back, {user?.name}! 🎉
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b', 
          maxWidth: '600px', 
          margin: '0 auto',
          lineHeight: '1.6',
          animation: 'fadeIn 1s ease-out 0.3s both'
        }}>
          Ready to challenge your mind? Dive into exciting escape room adventures and test your problem-solving skills.
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="dashboard-grid" style={{ marginBottom: '48px' }}>
        <StatCard 
          icon="👥" 
          title="Total Teams" 
          value={stats.totalTeams} 
          subtitle="Active teams in system"
          color="#667eea"
          gradient={['#667eea', '#764ba2']}
          delay={0.1}
        />
        <StatCard 
          icon="🎮" 
          title="Active Games" 
          value={stats.activeGames} 
          subtitle="Currently running"
          color="#f093fb"
          gradient={['#f093fb', '#f5576c']}
          delay={0.2}
        />
        <StatCard 
          icon="🏆" 
          title="Completed" 
          value={stats.completedQuizzes} 
          subtitle="Total quiz attempts"
          color="#4facfe"
          gradient={['#4facfe', '#00f2fe']}
          delay={0.3}
        />
        <StatCard 
          icon="⭐" 
          title="Avg Score" 
          value={`${stats.averageScore}%`} 
          subtitle="Overall performance"
          color="#43e97b"
          gradient={['#43e97b', '#38f9d7']}
          delay={0.4}
        />
      </div>

      {/* Quick Actions */}
      <div className="card fade-in" style={{ animationDelay: '0.5s' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '24px',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🚀 Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {quickActions.map((action, index) => (
            <ActionCard 
              key={action.to}
              {...action}
              delay={0.6 + index * 0.1}
            />
          ))}
        </div>
      </div>

      {/* Admin Section */}
      {user?.email === 'admin@escaperoom.com' && (
        <div className="card fade-in" style={{ animationDelay: '1s' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginBottom: '24px',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🔒 Admin Controls
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {adminActions.map((action, index) => (
              <ActionCard 
                key={action.to}
                {...action}
                delay={1.1 + index * 0.1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="card fade-in" style={{ 
        animationDelay: '1.5s',
        textAlign: 'center',
        background: '#f8fafc',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💡</div>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#334155',
          marginBottom: '12px',
          lineHeight: '1.4'
        }}>
          "The key to escape is not just in solving puzzles, but in thinking outside the box."
        </h3>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Ready to unlock your potential?</p>
      </div>
    </div>
  );
};

export default Dashboard;