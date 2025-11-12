# Teams API Documentation

## Architecture Note
This application uses **Express.js** backend (not Next.js), so API routes are implemented differently than the Next.js example provided.

## Current Implementation

### Endpoint
**GET** `/api/teams`

### Location
`backend/src/routes/teams.js`

### Implementation
```javascript
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('createdBy', 'name')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 });

    const teamsWithCounts = teams.map(team => ({
      id: team._id,
      name: team.name,
      description: team.description,
      created_by: team.createdBy._id,
      created_by_name: team.createdBy.name || 'System',
      created_at: team.createdAt,
      updated_at: team.updatedAt,
      member_count: team.members.length
    }));

    res.json(teamsWithCounts);
  } catch (error) {
    console.error('Teams fetch error:', error);
    res.status(500).json({ error: 'Failed to get teams: ' + error.message });
  }
});
```

## Features Implemented ✅

### 1. Database Connection
- MongoDB connection established via `connectDB()` in `server.js`
- Connection managed globally, not per-request
- Proper error handling for connection failures

### 2. Team Data Retrieval
- Uses Mongoose `Team.find()`
- Populates related user data
- Sorts by creation date (newest first)
- Transforms to plain objects with `.map()`

### 3. Response Handling
- Returns JSON array of teams
- Includes proper HTTP status codes (200, 500)
- Content-Type automatically set by Express

### 4. Error Handling
- Try-catch block for all operations
- Detailed error logging to console
- Meaningful error messages in response
- 500 status code for server errors

## Response Format

### Success (200)
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Team Alpha",
    "description": "First team",
    "created_by": "507f191e810c19729de860ea",
    "created_by_name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "member_count": 5
  }
]
```

### Error (500)
```json
{
  "error": "Failed to get teams: [error details]"
}
```

## Frontend Integration

### API Service
Location: `frontend/src/services/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Usage
const response = await api.get('/teams');
const teams = response.data;
```

### Component Usage
```javascript
const [teams, setTeams] = useState([]);

useEffect(() => {
  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Failed to load teams:', error);
    }
  };
  fetchTeams();
}, []);
```

## Testing

### Manual Test
```bash
# Start backend
cd backend
npm run dev

# Test endpoint
curl http://localhost:5000/api/teams
```

### Expected Response
- Status: 200 OK
- Content-Type: application/json
- Body: Array of team objects

## Troubleshooting

### "Failed to load teams" Error

**Possible Causes**:
1. Backend not running
2. MongoDB not connected
3. CORS issues
4. Network errors

**Solutions**:
1. Verify backend is running on port 5000
2. Check MongoDB connection in server logs
3. Ensure CORS is enabled in `server.js`
4. Check browser console for errors

### Empty Array Response

**Possible Causes**:
1. No teams in database
2. Database connection issue
3. Query error

**Solutions**:
1. Create test teams via POST endpoint
2. Verify MongoDB connection
3. Check server logs for errors

## Additional Endpoints

### Create Team
**POST** `/api/teams`
```json
{
  "name": "Team Name",
  "description": "Team description"
}
```

### Update Team
**PUT** `/api/teams/:id`
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

### Delete Team
**DELETE** `/api/teams/:id`

## Migration to Next.js (If Needed)

If you want to migrate to Next.js, here's the equivalent:

### File: `app/api/teams/route.js`
```javascript
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Team from '@/models/Team';

export async function GET() {
  try {
    await connectDB();
    const teams = await Team.find()
      .populate('createdBy', 'name')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const teamsWithCounts = teams.map(team => ({
      id: team._id.toString(),
      name: team.name,
      description: team.description,
      created_by: team.createdBy?._id?.toString(),
      created_by_name: team.createdBy?.name || 'System',
      created_at: team.createdAt,
      updated_at: team.updatedAt,
      member_count: team.members?.length || 0
    }));

    return NextResponse.json(teamsWithCounts);
  } catch (err) {
    console.error('teams GET failed', err);
    return NextResponse.json(
      { error: 'Failed to load teams' },
      { status: 500 }
    );
  }
}
```

## Success Criteria ✅

- ✅ API endpoint returns 200 status with teams data
- ✅ Frontend successfully displays teams
- ✅ Error cases properly handled and logged
- ✅ Database connection properly managed
- ✅ Response format matches frontend expectations

---

**Current Status**: Fully Implemented in Express.js
**Architecture**: React + Express + MongoDB
**Version**: 1.0.0
