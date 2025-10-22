import React from 'react';

const ProgressBar = ({ currentStage, completedStages, totalStages, puzzle }) => {
  const stages = Array.from({ length: totalStages }, (_, i) => i + 1);
  const stageCategories = {
    1: { name: 'Caesar', icon: '🔐' },
    2: { name: 'Base64', icon: '📜' },
    3: { name: 'Substitution', icon: '🔢' },
    4: { name: 'ROT13', icon: '🔄' },
    5: { name: 'Mixed', icon: '🧩' },
    6: { name: 'Final Escape', icon: '🏆' }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>Progress</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {stages.map(stage => {
          const isCompleted = completedStages.includes(stage);
          const isCurrent = stage === currentStage;
          
          return (
            <div
              key={stage}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: isCompleted ? '#d4edda' : isCurrent ? '#fff3cd' : '#e9ecef',
                border: isCurrent ? '2px solid #ffc107' : '1px solid transparent'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#28a745' : isCurrent ? '#ffc107' : '#6c757d',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginRight: '12px'
                }}
              >
                {isCompleted ? '✓' : stage}
              </div>
              <span style={{ 
                fontWeight: isCurrent ? 'bold' : 'normal',
                color: isCompleted ? '#155724' : isCurrent ? '#856404' : '#495057'
              }}>
                {stageCategories[stage]?.icon} {stageCategories[stage]?.name || `Stage ${stage}`}
                {isCompleted && ' - Completed'}
                {isCurrent && ' - Current'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;