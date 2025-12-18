# 🚧 Public Infrastructure Issue Reporting System

A comprehensive digital platform for citizens to report public infrastructure issues and for government staff to manage and resolve them efficiently.

---

## 🔗 Live Links

- **Live Site:** [https://your-live-site-url.web.app](https://your-live-site-url.web.app)
- **Server API:** [https://your-server-url.vercel.app](https://your-server-url.vercel.app)
- **Client Repository:** [GitHub Client](https://github.com/kohinurfatema/public-reporting-system-client)
- **Server Repository:** [GitHub Server](https://github.com/kohinurfatema/public-reporting-system-server)

---

## 🔐 Admin Credentials

- **Email:** admin@publicreport.com
- **Password:** admin123

---

## 👥 Test Credentials

### Staff Account
- **Email:** staff@publicreport.com
- **Password:** staff123
- **Note:** This staff member has assigned issues and active tasks

### Citizen Account
- **Email:** citizen@publicreport.com
- **Password:** citizen123
- **Note:** Free user with 2 issues already reported (1 remaining before subscription required)

---

## ✨ Key Features

1. **🏠 Comprehensive Home Page**
   - Beautiful responsive banner/slider showcasing the system
   - Latest resolved issues section with 6+ cards displaying issue details
   - Features section highlighting application capabilities
   - "How It Works" section explaining the workflow
   - Additional sections for stats and call-to-action
   - Professional footer with links and information

2. **📋 Advanced Issue Management**
   - All issues page with server-side pagination (10 items per page)
   - Server-side search by issue name, category, and location
   - Server-side filtering by status, priority, and category
   - Real-time upvote system (one vote per user, prevents self-voting)
   - Boosted issues automatically appear above normal priority issues
   - Issue cards display image, title, category, status badge, priority badge, location, and upvote count

3. **🔍 Detailed Issue Tracking System**
   - Comprehensive issue details page with full information display
   - Edit functionality for pending issues (modal-based editing)
   - Delete capability for issue submitters
   - Priority boost feature with Stripe payment integration (100 BDT)
   - Complete timeline/tracking section showing issue lifecycle
   - Timeline displays status changes, staff assignments, boosts, and resolutions
   - Shows staff information if assigned to the issue

4. **🔐 Role-Based Authentication**
   - Three distinct roles: Admin, Citizen, Staff
   - Email/password and Google Sign-in authentication
   - Private routes with persistent login (stays logged in after refresh)
   - Token-based JWT authentication with Firebase
   - Role-specific dashboard access and permissions
   - Middleware verification on all protected routes

5. **👤 Citizen Dashboard**
   - Dashboard home with statistics cards and PieChart visualization
   - My Issues page with filtering options (status, category)
   - Edit/delete functionality for pending issues
   - Report Issue form with real ImgBB image upload integration
   - Free user limit: Maximum 3 issues (Premium: unlimited)
   - Profile page with subscription payment option (1000 BDT)
   - Premium badge display for subscribed users
   - Payment history with downloadable PDF invoices
   - Blocked user warning system

6. **👨‍💼 Staff Dashboard**
   - Dashboard overview with assigned issues count, resolved count, and charts
   - PieChart for status distribution and BarChart for category distribution
   - Assigned issues page in tabular format with priority sorting
   - Status change dropdown (Pending → In-Progress → Working → Resolved → Closed)
   - Filtering options by status and priority
   - Boosted issues displayed above normal priority
   - Timeline entry creation on every status change
   - Profile management with image and name updates

7. **👨‍💼 Admin Dashboard**
   - Comprehensive dashboard with issue statistics, payment totals, and charts
   - PieChart for issue status distribution and BarChart for user statistics
   - Latest issues, payments, and registered users sections
   - All issues management in tabular format
   - Staff assignment modal with dropdown selection
   - Issue rejection capability for pending issues
   - Manage users page with block/unblock functionality
   - Manage staff page with full CRUD operations
   - Staff creation with Firebase Auth account (email & password)
   - Payments page with filtering and complete transaction history

8. **💳 Stripe Payment Integration**
   - Complete Stripe checkout session implementation
   - Two payment types: Issue Boost (100 BDT) and Premium Subscription (1000 BDT)
   - Secure payment verification after checkout
   - Automatic priority upgrade for boosted issues
   - Premium status activation for subscriptions
   - Transaction history with downloadable PDF invoices
   - Payment success and cancellation pages

9. **📊 Data Visualization**
   - Recharts library integration across all dashboards
   - Citizen dashboard: PieChart for issue status breakdown
   - Staff dashboard: PieChart + BarChart for status and category distribution
   - Admin dashboard: PieChart + BarChart for issues and user statistics
   - Responsive chart containers with proper color schemes
   - Interactive tooltips and legends

10. **🔔 Real-Time Notifications**
    - Toast notifications for all CRUD operations
    - Sweet Alert confirmations for critical actions
    - Loading states during data fetching and submissions
    - Success/error feedback for user actions
    - Payment status notifications

11. **📱 Fully Responsive Design**
    - Mobile-first approach with Tailwind CSS and DaisyUI
    - Responsive navbar with profile dropdown
    - All dashboard pages optimized for mobile, tablet, and desktop
    - Grid layouts adapting to screen sizes
    - Touch-friendly buttons and interactive elements

12. **⚡ Performance Optimizations**
    - TanStack Query for efficient data fetching and caching
    - Axios interceptors for seamless authentication
    - Lazy loading of components
    - Optimized image loading
    - Server-side pagination and filtering

13. **🛡️ Security Features**
    - Firebase Admin SDK for server-side authentication
    - JWT token verification middleware
    - Role-based access control (RBAC)
    - Environment variable protection for secrets
    - Secure payment processing with Stripe
    - Input validation on both client and server

14. **📝 Issue Timeline System**
    - Complete audit trail for every issue
    - Read-only timeline entries to preserve history
    - Tracks: creation, assignment, status changes, boosts, rejections, closures
    - Shows who made changes (Admin/Staff/Citizen)
    - Timestamp for every action
    - Color-coded status badges

15. **🎨 Modern UI/UX**
    - Professional design with consistent color scheme
    - Card-based layouts for better information hierarchy
    - Smooth transitions and animations
    - Intuitive navigation structure
    - Clear call-to-action buttons
    - Accessible forms with proper validation messages

---

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **@react-pdf/renderer** - PDF generation
- **Axios** - HTTP client
- **Firebase** - Authentication
- **Sweet Alert 2** - Beautiful alerts
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Firebase Admin SDK** - Authentication
- **Stripe** - Payment processing
- **JWT** - Token-based authentication
- **dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Firebase project
- Stripe account
- ImgBB API key

### Client Setup
```bash
# Clone the repository
git clone https://github.com/kohinurfatema/public-reporting-system-client.git
cd public-reporting-system-client

# Install dependencies
npm install

# Create .env.local file
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
VITE_image_host_key=your_imgbb_api_key
VITE_API_URL=http://localhost:5000

# Run development server
npm run dev
```

### Server Setup
```bash
# Clone the repository
git clone https://github.com/kohinurfatema/public-reporting-system-server.git
cd public-reporting-system-server

# Install dependencies
npm install

# Create .env file
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_ORIGIN=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
STRIPE_SECRET=your_stripe_secret_key
APP_NAME=Public Infrastructure Issue Reporting

# Add Firebase Admin SDK credentials (serviceAccountKey.json)
# Download from Firebase Console > Project Settings > Service Accounts

# Run development server
npm run dev
```

---

## 🚀 Deployment

### Client Deployment (Firebase Hosting)
```bash
npm run build
firebase deploy
```

### Server Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 📝 Challenge Tasks Completed

✅ **Token Verification & Role-Based Middleware** - Implemented JWT authentication with role-specific middleware
✅ **Pagination on All-Issues Page** - Server-side pagination with customizable page size
✅ **Search & Filter** - Server-side search and filtering with loading states
✅ **Downloadable PDF Invoices** - @react-pdf/renderer implementation in admin and user profile

---

## 🎯 Optional Tasks Completed

✅ **Axios Interceptors** - Implemented for seamless authentication
✅ **Prevent Multiple Upvotes** - Users can only upvote once per issue

---

## 📧 Contact & Support

For issues or questions, please contact:
- **Developer:** Kohinur Fatema
- **Email:** kohinurfatema35@gmail.com
- **GitHub:** [kohinurfatema](https://github.com/kohinurfatema)

---

## 📄 License

This project is part of an academic assignment for the Public Infrastructure Issue Reporting System.

---

**Note:** This is a fully functional application with real Stripe payment integration. For testing payments, use Stripe test card: `4242 4242 4242 4242` with any future expiry date and CVC.
