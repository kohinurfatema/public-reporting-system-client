# Getting Started Guide

## Public Infrastructure Issue Reporting System

This guide will help you set up the development environment and run the application locally.

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 20.x LTS | https://nodejs.org |
| npm | 10.x | Included with Node.js |
| Git | 2.x | https://git-scm.com |
| VS Code | Latest | https://code.visualstudio.com (recommended) |

### Verify Installation

```bash
node --version    # Should show v20.x.x
npm --version     # Should show 10.x.x
git --version     # Should show 2.x.x
```

---

## Project Setup

### 1. Clone the Repository

```bash
# Clone the main repository
git clone https://github.com/kohinurfatema/public-reporting-system-client.git
git clone https://github.com/kohinurfatema/public-reporting-system-server.git

# Or if in monorepo structure
cd assignment-11
```

### 2. Client Setup

```bash
# Navigate to client directory
cd public-reporting-system-client

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env` file:**

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Image Upload
VITE_IMAGE_HOST_KEY=your_imgbb_api_key
```

### 3. Server Setup

```bash
# Navigate to server directory
cd public-reporting-system-server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env` file:**

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server Configuration
PORT=5000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# App Info
APP_NAME=Public Infrastructure Issue Reporting System
```

### 4. Firebase Admin SDK Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Save the JSON file as `src/public-reporting-system-firebase-adminsdk.json` in the server directory

**Important:** This file is gitignored. Never commit credentials!

---

## Running the Application

### Start Development Servers

**Terminal 1 - Server:**
```bash
cd public-reporting-system-server
npm run dev
```

Server will start at: `http://localhost:5000`

**Terminal 2 - Client:**
```bash
cd public-reporting-system-client
npm run dev
```

Client will start at: `http://localhost:5173`

### Verify Setup

1. Open `http://localhost:5173` in your browser
2. You should see the home page
3. Check the browser console for any errors
4. Test the API: `http://localhost:5000/` should return a health check response

---

## Development Workflow

### Available Scripts

**Client:**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

**Server:**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start without auto-reload |

### Code Structure

**Client:**
```
src/
├── components/     # Reusable components
├── context/        # React contexts
├── hooks/          # Custom hooks
├── layouts/        # Page layouts
├── pages/          # Page components
├── routes/         # Route configuration
└── firebase/       # Firebase config
```

**Server:**
```
src/
├── config/         # Configuration files
├── middleware/     # Express middleware
├── models/         # Mongoose models
├── routes/         # API routes
└── index.js        # Entry point
```

---

## External Services Setup

### Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication:
   - Email/Password
   - Google Sign-In
3. Get web app config for client `.env`
4. Generate Admin SDK key for server

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (M0 free tier)
3. Create database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string for server `.env`

### ImgBB Setup

1. Create account at [ImgBB](https://imgbb.com)
2. Get API key from dashboard
3. Add to client `.env`

---

## Testing the Application

### Create Test Users

1. **Admin Account:**
   - Register with admin email in Firebase Console
   - Manually update role to 'admin' in MongoDB

2. **Staff Account:**
   - Use admin dashboard to create staff
   - Or manually in MongoDB with role: 'staff'

3. **Citizen Account:**
   - Register through the application

### Test Flows

1. **Citizen Flow:**
   - Register/Login
   - Report an issue
   - View my issues
   - Upvote issues
   - Boost priority (payment)

2. **Admin Flow:**
   - View all issues
   - Assign staff
   - Reject issues
   - Manage users/staff
   - View payments

3. **Staff Flow:**
   - View assigned issues
   - Change status
   - Track progress

---

## Troubleshooting

### Common Issues

**1. CORS Errors**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Ensure `ALLOWED_ORIGINS` in server `.env` includes your client URL.

**2. MongoDB Connection Failed**
```
MongoNetworkError: failed to connect
```
**Solution:**
- Check MongoDB URI in `.env`
- Whitelist your IP in Atlas
- Check network connectivity

**3. Firebase Auth Errors**
```
Firebase: Error (auth/invalid-api-key)
```
**Solution:** Verify Firebase config in client `.env`

**4. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use
```
**Solution:**
```bash
# Find process using port
lsof -i :5000
# Kill process
kill -9 <PID>
```

**5. Module Not Found**
```
Cannot find module 'xxx'
```
**Solution:**
```bash
rm -rf node_modules
npm install
```

---

## VS Code Extensions

Recommended extensions for development:

```json
{
  "recommendations": [
    "dsznajder.es7-react-js-snippets",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "eamodio.gitlens"
  ]
}
```

---

## Next Steps

After setup, you can:

1. Review the [Architecture Documentation](../ARCHITECTURE.md)
2. Read the [API Documentation](../api/README.md)
3. Check [Contributing Guidelines](../../CONTRIBUTING.md)
4. Start with Phase 2 features in [Development Plan](../../DEVELOPMENT_PLAN.md)

---

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Search existing GitHub issues
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details

---

*Document Version: 1.0.0*
*Last Updated: January 2, 2026*
