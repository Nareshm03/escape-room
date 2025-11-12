# Game API Documentation

## Overview

The Game API provides endpoints for managing and retrieving game status and stages.

---

## Endpoints

### GET `/api/game`

Retrieves the current active game status.

#### Request
```http
GET /api/game
```

#### Responses

**Success - Active Game Found (200)**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "eventName": "Escape Room Challenge",
  "isActive": true,
  "isCompleted": false,
  "startTime": "2024-01-01T00:00:00.000Z",
  "maxTeams": 50,
  "maxTeamSize": 5,
  "eventDescription": "Join the ultimate escape room challenge!"
}
```

**Success - No Active Game (200)**
```json
{
  "message": "no_active_game"
}
```

**Error - Server Error (500)**
```json
{
  "error": "Failed to fetch game: [error details]"
}
```

#### Implementation Details

1. **Database Connection**: Establishes connection before querying
2. **Query**: Uses `EventStatus.findOne({ isActive: true }).lean()`
3. **Error Handling**: Catches and logs all errors
4. **Response**: Returns appropriate status and data

---

### GET `/api/game/stages`

Retrieves all game stages.

#### Request
```http
GET /api/game/stages
```

#### Response

**Success (200)**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "stageNumber": 1,
    "title": "Stage 1",
    "puzzleText": "Solve this puzzle...",
    "correctAnswer": "answer"
  }
]
```

**Error (500)**
```json
{
  "error": "Failed to get stages: [error details]"
}
```

---

### POST `/api/game/submit`

Submits an answer for a game stage.

#### Request
```http
POST /api/game/submit
Content-Type: application/json

{
  "stageId": "507f1f77bcf86cd799439011",
  "answer": "user answer"
}
```

#### Response

**Success (200)**
```json
{
  "correct": true,
  "message": "Correct!"
}
```

**Error - Stage Not Found (404)**
```json
{
  "error": "Stage not found"
}
```

**Error - Server Error (500)**
```json
{
  "error": "Failed to submit answer: [error details]"
}
```

---

## Frontend Integration

### Handling Game Status

```javascript
import api from '../services/api';

const fetchGameStatus = async () => {
  try {
    const response = await api.get('/game');
    
    if (response.data.message === 'no_active_game') {
      // Show "No active game" message
      setMessage('No active game available');
      setGameData(null);
    } else {
      // Game data available
      setGameData(response.data);
      setMessage('');
    }
  } catch (error) {
    // Server error
    console.error('Error fetching game:', error);
    setMessage('Error loading game');
    setGameData(null);
  }
};
```

### Handling Game Stages

```javascript
const fetchStages = async () => {
  try {
    const response = await api.get('/game/stages');
    
    if (response.data && Array.isArray(response.data)) {
      setStages(response.data);
      setMessage('');
    } else {
      setStages([]);
      setMessage('No game stages available');
    }
  } catch (error) {
    console.error('Error loading stages:', error);
    setStages([]);
    setMessage('Error loading game');
  }
};
```

### UI States

```javascript
// Loading state
if (stages.length === 0 && !message) {
  return <div>Loading game...</div>;
}

// Error/No data state
if (stages.length === 0 && message) {
  return (
    <div>
      <h2>{message}</h2>
      <button onClick={fetchStages}>Retry</button>
    </div>
  );
}

// Success state
return <GameInterface stages={stages} />;
```

---

## Error Handling

### Backend Error Logging

All errors are logged to console with details:
```javascript
console.error('Error fetching game:', error);
```

### Frontend Error Display

Errors are displayed to users with retry options:
- "No active game available" - When no game is active
- "Error loading game" - When server error occurs
- "No game stages available" - When stages array is empty

---

## Testing

### Run Tests
```bash
node test-game-api.js
```

### Test Scenarios

1. **No Active Game**
   - Deactivate all games
   - Call `/api/game`
   - Expect: `{ message: 'no_active_game' }`

2. **Active Game Exists**
   - Create/activate a game
   - Call `/api/game`
   - Expect: Game object with `_id`, `eventName`, etc.

3. **Database Error**
   - Disconnect database
   - Call `/api/game`
   - Expect: 500 error with error message

4. **Stages Endpoint**
   - Call `/api/game/stages`
   - Expect: Array of stages (may be empty)

---

## Performance Considerations

### Caching
- Use `.lean()` for read-only queries (faster)
- Consider implementing Redis cache for frequently accessed data

### Optimization
- Database connection pooling (handled by Mongoose)
- Indexed queries on `isActive` field
- Minimal data transfer with `.lean()`

### Timeout Handling
```javascript
const response = await axios.get('/api/game', {
  timeout: 5000 // 5 second timeout
});
```

---

## Troubleshooting

### Issue: Infinite Loading

**Cause**: Frontend not handling all response scenarios

**Solution**: 
1. Check for `message === 'no_active_game'`
2. Handle empty arrays
3. Display error messages
4. Provide retry button

### Issue: 500 Errors

**Cause**: Database connection issues

**Solution**:
1. Check MongoDB connection string
2. Verify database is running
3. Check server logs for details

### Issue: No Data Returned

**Cause**: No active games in database

**Solution**:
1. Create a game via admin panel
2. Set `isActive: true`
3. Verify with database query

---

## Database Schema

### EventStatus Model
```javascript
{
  eventName: String,
  isActive: Boolean,
  isCompleted: Boolean,
  startTime: Date,
  endTime: Date,
  winnerTeam: ObjectId,
  maxTeams: Number,
  maxTeamSize: Number,
  eventDescription: String
}
```

### Query for Active Game
```javascript
EventStatus.findOne({ isActive: true })
```

---

## Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | Success | Game found or no active game |
| 404 | Not Found | Stage not found (submit endpoint) |
| 500 | Server Error | Database or server error |

---

## Best Practices

1. **Always handle all response scenarios**
   - Active game
   - No active game
   - Server error

2. **Provide user feedback**
   - Loading states
   - Error messages
   - Retry options

3. **Log errors for debugging**
   - Console.error on frontend
   - Console.error on backend

4. **Use appropriate HTTP status codes**
   - 200 for success (even if no data)
   - 500 for server errors
   - 404 for not found

5. **Implement timeout handling**
   - Prevent infinite waits
   - Show timeout errors to users

---

## Example Usage

### Complete Frontend Component

```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const GameComponent = () => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGame();
  }, []);

  const fetchGame = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get('/game');
      
      if (response.data.message === 'no_active_game') {
        setGame(null);
        setError('No active game available');
      } else {
        setGame(response.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load game');
      setGame(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error} <button onClick={fetchGame}>Retry</button></div>;
  if (!game) return <div>No game available</div>;
  
  return <div>Game: {game.eventName}</div>;
};
```

---

## Changelog

### Version 1.0.0
- Added `/api/game` endpoint
- Implemented proper error handling
- Added database connection management
- Fixed infinite loading issue
- Added comprehensive documentation
