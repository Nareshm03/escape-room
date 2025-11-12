# Game API - Quick Reference

## 🚀 Quick Start

### Backend Endpoint
```
GET /api/game
```

### Responses
- **Active game**: `{ _id, eventName, isActive, ... }`
- **No game**: `{ message: 'no_active_game' }`
- **Error**: `{ error: 'Failed to fetch game: ...' }` (500)

---

## 💻 Frontend Usage

```javascript
const response = await api.get('/game');

if (response.data.message === 'no_active_game') {
  // No active game
  setMessage('No active game available');
} else if (response.data._id) {
  // Game found
  setGame(response.data);
} else {
  // Handle error
  setMessage('Error loading game');
}
```

---

## 🧪 Testing

```bash
node test-game-api.js
```

---

## 📁 Files Changed

1. `backend/src/routes/game.js` - Added `/` endpoint
2. `frontend/src/pages/GameDashboard.js` - Fixed loading logic

---

## ✅ Fixed Issues

- ✅ Infinite "Loading game..." spinner
- ✅ No error handling
- ✅ No retry functionality
- ✅ Unclear response states

---

## 📚 Full Documentation

See [GAME_API_DOCUMENTATION.md](GAME_API_DOCUMENTATION.md)
