# Comprehensive Logging and Toast Notifications Guide

## Overview
Standardized logging and user feedback patterns for debugging and UX.

## Server-Side Implementation

### Logger Utility
**Location**: `backend/src/utils/logger.js`

**Usage**:
```javascript
const logger = require('../utils/logger');

// Error logging
logger.error('moduleName', 'Error message', error, { context });

// Info logging
logger.info('moduleName', 'Info message', { context });

// Request logging
logger.request(req, { additionalInfo });
```

**Format**:
```
[2024-01-01T12:00:00.000Z] ERROR in moduleName: Error message
Error details: {
  message: "...",
  stack: "...",
  context: {...}
}
```

### Example Implementation

#### Quiz Creation
```javascript
const logger = require('../utils/logger');

router.post('/create', async (req, res) => {
  logger.request(req, { questionsCount: req.body.questions?.length });
  
  try {
    const quiz = await Quiz.create(req.body);
    logger.info('quiz', 'Quiz created', { quizId: quiz._id });
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    logger.error('quiz', 'Quiz creation failed', error, {
      title: req.body.title
    });
    res.status(500).json({ error: error.message });
  }
});
```

#### Team Operations
```javascript
router.get('/', async (req, res) => {
  logger.request(req);
  
  try {
    const teams = await Team.find();
    logger.info('teams', 'Teams fetched', { count: teams.length });
    res.json(teams);
  } catch (error) {
    logger.error('teams', 'Failed to fetch teams', error);
    res.status(500).json({ error: 'Failed to load teams' });
  }
});
```

## Client-Side Implementation

### API Handler Utility
**Location**: `frontend/src/utils/apiHandler.js`

**Usage**:
```javascript
import { handleApiCall } from '../utils/apiHandler';
import { useToast } from '../utils/ToastContext';

const toast = useToast();

const result = await handleApiCall(
  () => api.post('/quiz/create', quizData),
  {
    successMessage: 'Quiz published successfully!',
    errorMessage: 'Failed to publish quiz',
    toast,
    logContext: { operation: 'createQuiz', title: quizData.title },
    onSuccess: (data) => navigate('/quiz-list'),
    onError: (error) => console.error('Additional handling', error)
  }
);
```

### Direct Implementation Pattern

#### With Toast Context
```javascript
import { useToast } from '../utils/ToastContext';

const MyComponent = () => {
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      console.log('Creating quiz:', { title, questions });
      const response = await api.post('/quiz/create', data);
      
      console.log('Quiz created successfully:', response.data);
      toast.success('Quiz published successfully!');
      navigate('/quiz-list');
    } catch (error) {
      console.error('Quiz creation failed:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const message = error.response?.data?.error || 
                     error.response?.data?.message || 
                     'Failed to publish quiz';
      toast.error(message);
    }
  };
};
```

#### With Custom Hook
```javascript
import { useQuizPublish } from '../hooks/useQuizPublish';

const { publishQuiz, loading } = useQuizPublish();

const handlePublish = async () => {
  const result = await publishQuiz(quizData);
  if (result.success) {
    // Success handled automatically
  }
};
```

## Toast Configuration

### Current Implementation
The app uses custom `ToastContext` (not react-hot-toast).

**Location**: `frontend/src/utils/ToastContext.js`

**Features**:
- Auto-dismiss: 5 seconds (success), manual (error)
- Position: Bottom-right
- Types: success, error, warning

**Usage**:
```javascript
import { useToast } from '../utils/ToastContext';

const toast = useToast();

toast.success('Operation successful');
toast.error('Operation failed');
toast.warning('Please check your input');
```

## Logging Patterns

### Backend Patterns

#### Success Case
```javascript
try {
  const result = await operation();
  logger.info('module', 'Operation successful', { 
    resultId: result._id,
    timestamp: Date.now()
  });
  res.json({ success: true, data: result });
} catch (error) {
  // Error handling
}
```

#### Error Case
```javascript
catch (error) {
  logger.error('module', 'Operation failed', error, {
    userId: req.user?.id,
    requestBody: sanitize(req.body)
  });
  res.status(500).json({ 
    error: 'User-friendly message',
    message: error.message 
  });
}
```

### Frontend Patterns

#### API Call Pattern
```javascript
// Before call
console.log('API call:', { endpoint, method, data });

try {
  const response = await api.post(endpoint, data);
  
  // Success
  console.log('API success:', { 
    status: response.status, 
    data: response.data 
  });
  toast.success('Success message');
  
} catch (error) {
  // Error
  console.error('API error:', {
    endpoint,
    error: error.message,
    response: error.response?.data,
    status: error.response?.status
  });
  toast.error(error.response?.data?.error || 'Error message');
}
```

## Sensitive Data Handling

### Backend Sanitization
```javascript
const sanitizeBody = (body) => {
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });
  
  return sanitized;
};
```

### Frontend Sanitization
```javascript
// Don't log sensitive data
console.log('User login:', { 
  email: user.email,
  // password: user.password // NEVER LOG
});
```

## Testing Checklist

### Server Logs
- [ ] All errors logged with timestamp
- [ ] Module name included
- [ ] Error stack trace captured
- [ ] Request context included
- [ ] Sensitive data sanitized

### Client Toasts
- [ ] Success operations show toast
- [ ] Error operations show toast
- [ ] Messages are clear and actionable
- [ ] Auto-dismiss works (4-6 seconds)
- [ ] No sensitive data displayed

### Console Logs
- [ ] API calls logged before execution
- [ ] Success responses logged
- [ ] Error responses logged with details
- [ ] Context information included

## Common Patterns

### Create Operation
```javascript
// Backend
logger.request(req);
try {
  const item = await Model.create(data);
  logger.info('module', 'Created', { id: item._id });
  res.status(201).json({ success: true, item });
} catch (error) {
  logger.error('module', 'Create failed', error, { data });
  res.status(500).json({ error: error.message });
}

// Frontend
try {
  console.log('Creating item:', data);
  const response = await api.post('/items', data);
  console.log('Item created:', response.data);
  toast.success('Item created successfully!');
} catch (error) {
  console.error('Create failed:', error);
  toast.error(error.response?.data?.error || 'Failed to create item');
}
```

### Fetch Operation
```javascript
// Backend
logger.request(req);
try {
  const items = await Model.find();
  logger.info('module', 'Fetched', { count: items.length });
  res.json(items);
} catch (error) {
  logger.error('module', 'Fetch failed', error);
  res.status(500).json({ error: 'Failed to fetch items' });
}

// Frontend
try {
  console.log('Fetching items');
  const response = await api.get('/items');
  console.log('Items fetched:', { count: response.data.length });
  setItems(response.data);
} catch (error) {
  console.error('Fetch failed:', error);
  toast.error('Failed to load items');
}
```

## Expected Outcomes ✅

- ✅ Developers can quickly identify issues through detailed logs
- ✅ Users receive immediate, friendly feedback
- ✅ Consistent error handling patterns throughout
- ✅ Critical errors logged and surfaced appropriately
- ✅ Sensitive data never logged or displayed

---

**Status**: ✅ Utilities Created
**Toast System**: Custom ToastContext
**Logger**: Centralized utility
**Version**: 1.0.0
