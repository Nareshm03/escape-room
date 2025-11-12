# Event Control - Quick Start

## 🚀 5-Minute Setup

### 1. Backend Running
```bash
cd backend && npm run dev
```

### 2. Test API
```bash
node test-event-api.js
```

### 3. Use in Frontend
```jsx
import EventControlPanel from './components/EventControlPanel';

<EventControlPanel />
```

---

## 📡 API Endpoints

```
POST /api/event/start   - Start game
POST /api/event/pause   - Pause game
POST /api/event/reset   - Reset game
GET  /api/event/status/:id - Get status
```

**Auth Header**: `x-admin-key: dev-admin-key`

---

## 🎮 Frontend Usage

```jsx
// In Admin Dashboard
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

## 🧪 Quick Test

```bash
# Start backend first
cd backend && npm run dev

# In another terminal
node test-event-api.js

# Expected: ✅ Passed: 9/9
```

---

## 📊 State Flow

```
Inactive → [Start] → Active
Active → [Pause] → Inactive
Any → [Reset] → Inactive
```

---

## 🔑 Environment Setup

Add to `backend/.env`:
```
ADMIN_KEY=your-secure-key
```

---

## 📚 Full Docs

- [EVENT_CONTROL_DOCUMENTATION.md](EVENT_CONTROL_DOCUMENTATION.md) - Complete guide
- [EVENT_CONTROL_SUMMARY.md](EVENT_CONTROL_SUMMARY.md) - Implementation details

---

## ✅ Status

**Ready to use!** All features implemented and tested.
