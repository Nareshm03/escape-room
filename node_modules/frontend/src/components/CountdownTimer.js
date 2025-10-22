import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ timeRemaining, onTimeUp }) => {
  const [time, setTime] = useState(timeRemaining);

  useEffect(() => {
    setTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp && onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTime(prevTime => {
        const newTime = prevTime - 1000;
        if (newTime <= 0) {
          onTimeUp && onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time, onTimeUp]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isLowTime = time < 300000; // Less than 5 minutes

  return (
    <div style={{
      fontSize: '24px',
      fontWeight: 'bold',
      color: isLowTime ? '#dc3545' : '#28a745',
      textAlign: 'center',
      padding: '10px',
      border: `2px solid ${isLowTime ? '#dc3545' : '#28a745'}`,
      borderRadius: '8px',
      backgroundColor: isLowTime ? '#fff5f5' : '#f8fff8'
    }}>
      ⏰ {formatTime(time)}
    </div>
  );
};

export default CountdownTimer;