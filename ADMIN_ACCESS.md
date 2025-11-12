# Admin Access Control Documentation

## Overview
Role-based access control implementation for the Admin Panel with client-side and route-level protection.

## Features Implemented

### 1. **Navbar Admin Panel Link**
- **Location**: `src/components/Navbar.js`
- **Visibility**: Only shown to users with admin role
- **Test ID**: `admin-panel-link` for automated testing
- **Icon**: 🛠️ (wrench/tools emoji)

### 2. **Role Detection**
Admin status is determined by:
- Primary: `user.role === 'admin'`
- Fallback: `user.email === 'admin@escaperoom.com'`

### 3. **Route Protection**
- **Component**: `src/components/AdminRoute.js`
- **Route**: `/admin`
- **Protection Layers**:
  1. `ProtectedRoute` - Ensures user is authenticated
  2. `AdminRoute` - Ensures user has admin privileges

### 4. **Access Denied Handling**
Non-admin users attempting to access `/admin` see:
- 🚫 Access Denied message
- Clear explanation text
- "Go Back" button to return to previous page

## Usage

### For Developers

#### Checking Admin Status
```javascript
import { useAuth } from '../utils/AuthContext';

const { user } = useAuth();
const isAdmin = user?.role === 'admin' || user?.email === 'admin@escaperoom.com';
```

#### Protecting Admin Routes
```javascript
import AdminRoute from './components/AdminRoute';

<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    </ProtectedRoute>
  } 
/>
```

#### Conditional Admin UI Elements
```javascript
{user?.role === 'admin' && (
  <Link to="/admin" data-testid="admin-panel-link">
    Admin Panel
  </Link>
)}
```

### For Users

#### Admin Access
1. Log in with admin credentials
2. Admin Panel link appears in navbar
3. Click to access admin dashboard
4. Full access to admin features

#### Non-Admin Users
1. Log in with regular credentials
2. No Admin Panel link visible
3. Direct URL access shows "Access Denied"
4. Can use "Go Back" button to return

## Testing

### Unit Tests
**File**: `src/__tests__/Navbar.admin.test.js`
- ✅ Admin link hidden for non-admin users
- ✅ Admin link shown for admin role
- ✅ Admin link shown for admin email fallback
- ✅ Admin link hidden when not logged in
- ✅ Correct href attribute
- ✅ Proper accessibility attributes

**File**: `src/__tests__/AdminRoute.test.js`
- ✅ Renders content for admin users
- ✅ Renders content for admin email fallback
- ✅ Shows access denied for non-admin
- ✅ Redirects to login when not authenticated
- ✅ Access denied page has go back button

### Manual Testing Checklist
- [ ] Log in as non-admin → Admin link not visible
- [ ] Log in as admin → Admin link visible
- [ ] Click admin link → Navigate to admin dashboard
- [ ] Direct URL `/admin` as non-admin → Access denied
- [ ] Direct URL `/admin` as admin → Dashboard loads
- [ ] Responsive design on mobile devices
- [ ] Hover/focus states work correctly
- [ ] No layout shift when link appears

### Test Commands
```bash
# Run all tests
npm test

# Run admin-specific tests
npm test Navbar.admin.test.js
npm test AdminRoute.test.js

# Run with coverage
npm test -- --coverage
```

## Security Considerations

### Client-Side Protection
- ✅ Conditional rendering based on user role
- ✅ Route-level access control
- ✅ Graceful error handling for unauthorized access

### Server-Side Protection (Required)
⚠️ **Important**: Client-side protection alone is not sufficient!

Backend API endpoints must verify admin role:
```javascript
// Example backend middleware
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

app.get('/api/admin/stats', requireAdmin, (req, res) => {
  // Admin-only logic
});
```

## Styling

### Navbar Link
- Inherits existing `nav-item` styles
- Smooth underline animation on active state
- Responsive design for mobile/tablet/desktop
- Proper hover and focus states

### Access Denied Page
- Centered layout with emoji icon
- Clear typography hierarchy
- Styled "Go Back" button
- Matches application theme

## Browser Support
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS/Android)

## Accessibility
- ✅ ARIA attributes on links
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Focus management
- ✅ Semantic HTML structure

## Future Enhancements
- [ ] Multiple admin role levels (super admin, moderator, etc.)
- [ ] Permission-based access control (RBAC)
- [ ] Admin activity logging
- [ ] Session timeout for admin users
- [ ] Two-factor authentication for admin accounts

## Troubleshooting

### Admin link not appearing
1. Check user object has `role: 'admin'` or correct email
2. Verify user is logged in
3. Check browser console for errors
4. Clear localStorage and re-login

### Access denied when should have access
1. Verify user role in AuthContext
2. Check AdminRoute logic
3. Ensure user object is properly set after login
4. Check for typos in role comparison

### Tests failing
1. Ensure all dependencies installed: `npm install`
2. Check mock providers are correctly configured
3. Verify test data matches expected structure
4. Run tests in isolation to identify conflicts

## Commit Information
**Message**: `feat: add role-based admin panel link to navbar`

**Changes**:
- Modified `src/components/Navbar.js` - Added admin link with conditional rendering
- Created `src/components/AdminRoute.js` - Route protection component
- Modified `src/App.js` - Added AdminRoute wrapper to admin route
- Created `src/__tests__/Navbar.admin.test.js` - Navbar admin tests
- Created `src/__tests__/AdminRoute.test.js` - AdminRoute tests
- Created `ADMIN_ACCESS.md` - This documentation

## Support
For issues or questions, please:
1. Check this documentation
2. Review test files for usage examples
3. Check browser console for errors
4. Contact development team
