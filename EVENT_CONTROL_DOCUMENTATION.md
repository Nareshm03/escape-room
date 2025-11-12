# Event Control System - Documentation

## Overview

Complete admin control system for managing game events with start, pause, and reset functionality.

---

## Backend API

### Base URL
```
/api/event
```

### Authentication
All admin endpoints require `x-admin-key` header:
```
x-admin-key: dev-admin-key
```

---

## Endpoints

### 1. Start Event
**POST** `/api/event/start`

Starts a game event and sets the start time.

**Request**:
```json
{
  "gameId": "507f1f77bcf86cd799439011"
}
```

**Headers**:
```
x-admin-key: dev-admin-key
```

**Success Response (200)**:
```json
{
  "message": "Game started successfully",
  "game": {
    "_id": "507f1f77bcf86cd799439011",
    "isActive": true,
    "startTime": "2024-01-01T00:00:00.000Z",
    "eventName": "Escape Room Challenge"
  }
}
```

**Error Responses**:
- `400`: Game already active
- `401`: Unauthorized
- `404`: Game not found
- `500`: Server error

---

### 2. Pause Event
**POST** `/api/event/pause`

Pauses an active game event.

**Request**:
```json
{
  "gameId": "507f1f77bcf86cd799439011"
}
```

**Success Response (200)**:
```json
{
  "message": "Game paused successfully",
  "game": {
    "_id": "507f1f77bcf86cd799439011",
    "isActive": false
  }
}
```

**Error Responses**:
- `400`: Game not active
- `401`: Unauthorized
- `404`: Game not found

---

### 3. Reset Event
**POST** `/api/event/reset`

Resets a game to initial state.

**Request**:
```json
{
  "gameId": "507f1f77bcf86cd799439011"
}
```

**Success Response (200)**:
```json
{
  "message": "Game reset successfully",
  "game": {
    "_id": "507f1f77bcf86cd799439011",
    "isActive": false,
    "isCompleted": false,
    "startTime": null,
    "endTime": null
  }
}
```

---

### 4. Get Status
**GET** `/api/event/status/:gameId`

Retrieves current game status (no auth required).

**Success Response (200)**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "eventName": "Escape Room Challenge",
  "isActive": true,
  "isCompleted": false,
  "startTime": "2024-01-01T00:00:00.000Z"
}
```

---

## Frontend Component

### EventControlPanel

React component for admin control.

**Usage**:
```jsx
import EventControlPanel from './components/EventControlPanel';

function AdminPage() {
  return <EventControlPanel />;
}
```

**Features**:
- Game ID input
- Real-time status display
- Start/Pause/Reset buttons
- Toast notifications
- Button state management

---

## State Transitions

### Valid Transitions

```
Inactive → Start → Active
Active → Pause → Inactive
Any State → Reset → Inactive
```

### Invalid Transitions (Blocked)

```
Active → Start (Error: Already active)
Inactive → Pause (Error: Not active)
```

---

## Testing

### Run Tests
```bash
node test-event-api.js
```

### Test Coverage
1. ✅ Start game
2. ✅ Start already active game (fail)
3. ✅ Pause game
4. ✅ Pause inactive game (fail)
5. ✅ Reset game
6. ✅ Unauthorized access (fail)
7. ✅ Missing game ID (fail)
8. ✅ Invalid game ID (fail)
9. ✅ Get game status

---

## Security

### Authentication
- Admin key required for all mutations
- Read-only status endpoint public
- Keys stored in environment variables

### Validation
- Game ID format validation
- State transition validation
- Input sanitization

### Logging
All admin actions logged:
```
[ADMIN] Game 507f... started at 2024-01-01T00:00:00.000Z
[ADMIN] Game 507f... paused
[ADMIN] Game 507f... reset
```

---

## Error Handling

### Backend
```javascript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Failed: ' + error.message });
}
```

### Frontend
```javascript
try {
  await api.post('/event/start', { gameId });
  success('Game started');
} catch (err) {
  showError(err.response?.data?.error || 'Failed');
}
```

---

## UI States

### Button States

| Action | Enabled When |
|--------|-------------|
| Start | Game inactive or completed |
| Pause | Game active |
| Reset | Always |

### Status Colors

| Status | Color |
|--------|-------|
| Active | Green |
| Inactive | Yellow |
| Completed | Blue |
| Unknown | Gray |

---

## Integration

### Add to Admin Dashboard

```jsx
import EventControlPanel from '../components/EventControlPanel';

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <EventControlPanel />
    </div>
  );
}
```

---

## Environment Variables

### Backend `.env`
```
ADMIN_KEY=your-secure-admin-key
MONGODB_URI=mongodb+srv://...
```

---

## Files Created

### Backend
- `backend/src/routes/event.js` - API routes
- `backend/src/server.js` - Updated with event routes

### Frontend
- `frontend/src/components/EventControlPanel.js` - Admin UI
- `frontend/src/components/EventControlPanel.css` - Styles

### Testing
- `test-event-api.js` - Integration tests

### Documentation
- `EVENT_CONTROL_DOCUMENTATION.md` - This file

---

## Quick Start

1. **Start backend**:
```bash
cd backend && npm run dev
```

2. **Start frontend**:
```bash
cd frontend && npm start
```

3. **Run tests**:
```bash
node test-event-api.js
```

4. **Access admin panel**:
Navigate to admin dashboard and use EventControlPanel component

---

## Status: ✅ Complete

All requirements implemented:
- ✅ Three secure API endpoints
- ✅ Admin authentication
- ✅ State validation
- ✅ Frontend control panel
- ✅ Toast notifications
- ✅ Error handling
- ✅ Comprehensive tests
- ✅ Audit logging
- ✅ Documentation
