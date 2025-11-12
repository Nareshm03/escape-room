# Performance Optimization Guide

## Quick Fixes

### 1. Reduce Animations (Immediate)
Add to `index.css`:
```css
* {
  animation-duration: 0.2s !important;
  transition-duration: 0.15s !important;
}

.floating-shapes { display: none !important; }
@keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } }
```

### 2. Lazy Load Routes
Update `App.js`:
```javascript
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const QuizList = lazy(() => import('./pages/QuizList'));

// Wrap routes
<Suspense fallback={<div>Loading...</div>}>
  <Route path="/admin" element={<AdminDashboard />} />
</Suspense>
```

### 3. Optimize Images
- Remove animated backgrounds
- Use CSS gradients instead of images
- Compress any images to WebP format

### 4. Reduce Font Weights
Change font import:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
```

### 5. Remove Heavy Libraries
Check `package.json` and remove unused:
```bash
npm uninstall framer-motion  # If not critical
```

### 6. Backend Optimization
Add to `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### 7. Database Indexes
Add indexes to frequently queried fields:
```javascript
// In Team model
teamSchema.index({ createdAt: -1 });
teamSchema.index({ name: 1 });
```

### 8. API Response Caching
```javascript
// Simple cache
const cache = {};
router.get('/teams', async (req, res) => {
  if (cache.teams && Date.now() - cache.teamsTime < 30000) {
    return res.json(cache.teams);
  }
  const teams = await Team.find();
  cache.teams = teams;
  cache.teamsTime = Date.now();
  res.json(teams);
});
```

## Immediate Actions

1. **Disable animations**: Add performance.css
2. **Remove floating shapes**: Hide decorative elements
3. **Reduce font weights**: Load only 400 and 600
4. **Enable compression**: Install and use compression middleware
5. **Add loading states**: Show spinners instead of blank screens

## Install Compression
```bash
cd backend
npm install compression
```

Add to server.js:
```javascript
const compression = require('compression');
app.use(compression());
```

## Results Expected
- Initial load: 3s → 1s
- Page transitions: 1s → 0.3s
- API calls: 500ms → 200ms

---

**Priority**: HIGH
**Impact**: 3-5x faster
