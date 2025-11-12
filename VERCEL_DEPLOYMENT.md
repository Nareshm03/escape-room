# Vercel Deployment Guide

## 📋 Configuration Overview

### Project Structure
```
escape-room-app/
├── api/
│   └── index.js          ✅ Serverless function entry point
├── frontend/
│   ├── src/
│   ├── build/            (generated)
│   └── package.json
├── backend/
│   └── src/
│       └── server.js     (Express app)
├── vercel.json           ✅ Deployment configuration
└── package.json
```

## 🔧 Configuration Files

### 1. `/api/index.js`
Entry point for all backend API routes. Handles:
- Database connection initialization
- Express app routing
- Error handling

### 2. `/vercel.json`
Defines build and routing configuration:
- **Frontend**: Static build from React app
- **Backend**: Serverless functions via @vercel/node
- **Routes**: API requests → `/api/index.js`, Frontend → static files

### 3. `/frontend/.env.production`
Disables ESLint during production build to prevent warnings from blocking deployment.

## 🚀 Deployment Steps

### Step 1: Prepare Repository
```bash
git add .
git commit -m "Configure Vercel deployment"
git push origin main
```

### Step 2: Vercel Dashboard Setup
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (leave as root)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`

### Step 3: Environment Variables
Add in Vercel Dashboard → Settings → Environment Variables:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/escape-room-app
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=production
```

### Step 4: Deploy
Click "Deploy" and wait for build to complete.

## ✅ Testing Deployment

### Test API Endpoints
```bash
# Health check
curl https://your-app.vercel.app/api/health

# Auth endpoint
curl https://your-app.vercel.app/api/auth/me

# Quiz endpoint
curl https://your-app.vercel.app/api/quiz
```

### Test Frontend
Visit: `https://your-app.vercel.app`

Expected pages:
- `/` - Home/Dashboard
- `/login` - Login page
- `/register` - Registration
- `/teams` - Teams management
- `/quiz` - Quiz interface
- `/leaderboard` - Live leaderboard

### Run Test Script
```bash
VERCEL_URL=https://your-app.vercel.app node test-deployment.js
```

## 🔍 Troubleshooting

### Build Fails
- Check ESLint errors: Ensure `.env.production` has `DISABLE_ESLINT_PLUGIN=true`
- Verify `vercel-build` script exists in `frontend/package.json`
- Check build logs for missing dependencies

### API Routes 404
- Verify `/api/index.js` exists at project root
- Check `vercel.json` routes configuration
- Ensure backend dependencies are in root `package.json`

### Database Connection Fails
- Verify `MONGODB_URI` environment variable is set
- Check MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)
- Confirm database user has read/write permissions

### Frontend Not Loading
- Check `outputDirectory` is set to `frontend/build`
- Verify React build completes successfully
- Check browser console for errors

## 📊 Success Criteria

✅ All `/api/*` routes return valid responses (not 404)  
✅ Frontend loads and displays correctly  
✅ Authentication flow works (login/register)  
✅ Database operations succeed  
✅ No CORS errors in browser console  
✅ All environment variables are set  
✅ Build completes without errors  

## 🔄 Redeployment

After making changes:
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel automatically redeploys on push to main branch.

## 📝 Notes

- **Cold Starts**: First request may be slow (serverless function initialization)
- **Logs**: View in Vercel Dashboard → Deployments → Function Logs
- **Domains**: Add custom domain in Vercel Dashboard → Settings → Domains
- **Rollback**: Use Vercel Dashboard → Deployments → Promote to Production

## 🆘 Support

If deployment fails:
1. Check Vercel build logs
2. Verify all configuration files are committed
3. Test locally: `npm run build` in frontend directory
4. Review environment variables
5. Check MongoDB Atlas connection string
