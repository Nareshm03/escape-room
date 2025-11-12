# ✅ Vercel Deployment Checklist

## Pre-Deployment

- [x] `/api/index.js` created at project root
- [x] `/vercel.json` configured with builds and routes
- [x] `frontend/.env.production` has `DISABLE_ESLINT_PLUGIN=true`
- [x] `frontend/package.json` has `vercel-build` script
- [x] Root `package.json` has all backend dependencies
- [x] `.vercelignore` excludes test files and .env
- [ ] All changes committed to Git
- [ ] Pushed to GitHub main branch

## Vercel Dashboard Setup

- [ ] Repository imported to Vercel
- [ ] Framework preset: **Other**
- [ ] Root directory: **`.`** (root)
- [ ] Build command: `cd frontend && npm install && npm run build`
- [ ] Output directory: `frontend/build`

## Environment Variables (Required)

- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Secret key for JWT tokens
- [ ] `PORT` - Set to `5000`
- [ ] `NODE_ENV` - Set to `production`

## Post-Deployment Testing

### API Endpoints
- [ ] `/api/health` returns 200 OK
- [ ] `/api/auth/register` accepts POST
- [ ] `/api/auth/login` accepts POST
- [ ] `/api/teams` returns data (with auth)
- [ ] `/api/quiz` returns data
- [ ] `/api/leaderboard` returns data
- [ ] `/api/settings` returns data

### Frontend Routes
- [ ] `/` loads homepage
- [ ] `/login` loads login page
- [ ] `/register` loads registration
- [ ] `/teams` loads teams page
- [ ] `/quiz` loads quiz interface
- [ ] `/leaderboard` loads leaderboard
- [ ] `/admin` loads admin dashboard (with auth)

### Functionality
- [ ] User registration works
- [ ] User login works
- [ ] JWT authentication persists
- [ ] Team creation works
- [ ] Quiz submission works
- [ ] Leaderboard updates
- [ ] No CORS errors in console
- [ ] No 404 errors for API routes

## MongoDB Atlas Configuration

- [ ] Database user created with read/write permissions
- [ ] IP whitelist includes `0.0.0.0/0` (allow all)
- [ ] Connection string is correct
- [ ] Database name matches connection string

## Common Issues

### Build Fails
- Check ESLint warnings → Ensure `DISABLE_ESLINT_PLUGIN=true`
- Missing dependencies → Add to root `package.json`
- Build timeout → Optimize build process

### API 404 Errors
- Verify `/api/index.js` exists
- Check `vercel.json` routes order (API before frontend)
- Ensure backend exports Express app

### Database Connection Fails
- Verify `MONGODB_URI` environment variable
- Check MongoDB Atlas IP whitelist
- Confirm database user permissions

### Frontend Not Loading
- Check `outputDirectory` is `frontend/build`
- Verify build completes successfully
- Check for JavaScript errors in console

## Success Indicators

✅ Build completes in < 5 minutes  
✅ All API routes return valid responses  
✅ Frontend loads without errors  
✅ Authentication flow works end-to-end  
✅ Database operations succeed  
✅ No console errors  

## Next Steps After Successful Deployment

1. Test all features thoroughly
2. Add custom domain (optional)
3. Set up monitoring/alerts
4. Configure analytics
5. Share deployment URL with team

---

**Deployment URL**: `https://your-app.vercel.app`  
**Dashboard**: `https://vercel.com/dashboard`  
**Logs**: Vercel Dashboard → Deployments → Function Logs
