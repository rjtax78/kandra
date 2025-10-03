# Role-Based Authentication System

This document explains how to set up and use the role-based authentication system in Kandra, which manages different user types: **Students**, **Companies**, and **Admins**.

## 🎯 System Overview

The Kandra platform supports three distinct user roles:

- **👨‍🎓 Students**: Can browse and apply for jobs
- **🏢 Companies**: Can post jobs and manage applications  
- **👩‍💼 Admins**: Can manage the entire platform

Each role has specific permissions and access to different parts of the application.

## 🔧 Setting User Roles in Clerk

### Method 1: Via Clerk Dashboard (Recommended for Testing)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to your application
3. Go to **Users** section
4. Click on a user
5. Scroll to **Public Metadata** section
6. Add the following JSON:

```json
{
  "role": "student"
}
```

Replace `"student"` with `"company"` or `"admin"` as needed.

### Method 2: Programmatically (Production Setup)

You can set roles during user registration or via API:

```javascript
// During registration (in your backend)
await clerkClient.users.updateUser(userId, {
  publicMetadata: {
    role: 'student' // or 'company' or 'admin'
  }
});
```

## 🚀 User Experience Flow

### Student Flow
1. **Registration/Login** → User signs up or logs in
2. **Role Assignment** → User gets `role: "student"` in metadata
3. **Automatic Redirect** → Redirected to `/dokarti` (job search page)
4. **Available Features**:
   - Browse job listings
   - Apply for positions
   - Manage applications
   - Profile management

### Company Flow
1. **Registration/Login** → Company representative signs up
2. **Role Assignment** → User gets `role: "company"` in metadata  
3. **Automatic Redirect** → Redirected to `/company/dashboard`
4. **Available Features**:
   - Post job listings
   - Manage job posts
   - View applications
   - Company analytics
   - Applicant management

### Admin Flow
1. **Registration/Login** → Admin user signs up (restricted)
2. **Role Assignment** → User gets `role: "admin"` in metadata
3. **Automatic Redirect** → Redirected to `/admin/dashboard`
4. **Available Features**:
   - User management
   - Platform analytics
   - Content moderation
   - System configuration
   - Full platform oversight

## 🛡️ Route Protection

### Protected Routes

**Student Routes** (require `role: "student"`):
- `/dokarti` - Job search and browsing
- `/etudiant/*` - Student-specific pages

**Company Routes** (require `role: "company"`):
- `/company/dashboard` - Company dashboard
- `/company/*` - Company management pages

**Admin Routes** (require `role: "admin"`):
- `/admin/dashboard` - Admin control panel
- `/admin/*` - Admin management pages

### Public Routes
- `/` - Home page
- `/login` - Authentication
- `/register` - Registration

### Legacy Routes (accessible by all authenticated users)
- `/dashboard` - General dashboard
- `/opportunities` - Legacy opportunities page
- `/profil` - User profile
- And other existing routes...

## 🔐 Permission System

Each role has specific permissions defined in `src/utils/roleUtils.js`:

### Student Permissions
- `browse_jobs` - Browse job listings
- `apply_for_jobs` - Apply for positions
- `manage_applications` - Track applications
- `view_profile` - View own profile
- `edit_profile` - Edit profile information

### Company Permissions
- `post_jobs` - Create job postings
- `manage_job_posts` - Edit/delete job posts
- `view_applications` - See job applications
- `manage_company_profile` - Company profile management
- `view_analytics` - Access company analytics

### Admin Permissions
- `manage_users` - User management
- `manage_companies` - Company oversight
- `manage_jobs` - Job moderation
- `view_system_analytics` - Platform analytics
- `moderate_content` - Content moderation
- `system_configuration` - System settings

## 💻 Usage in Components

### Check User Role

```javascript
import { useUser } from '@clerk/clerk-react';
import { getUserRole } from '../utils/roleUtils';

const MyComponent = () => {
  const { user } = useUser();
  const userRole = getUserRole(user);
  
  return (
    <div>
      Current role: {userRole}
    </div>
  );
};
```

### Check Permissions

```javascript
import { useUser } from '@clerk/clerk-react';
import { hasPermission } from '../utils/roleUtils';

const MyComponent = () => {
  const { user } = useUser();
  const canPostJobs = hasPermission(user, 'post_jobs');
  
  return (
    <div>
      {canPostJobs && (
        <button>Post New Job</button>
      )}
    </div>
  );
};
```

### Role-Specific Rendering

```javascript
import { useUser } from '@clerk/clerk-react';
import { getUserRole, USER_ROLES } from '../utils/roleUtils';

const Navigation = () => {
  const { user } = useUser();
  const role = getUserRole(user);
  
  return (
    <nav>
      {role === USER_ROLES.STUDENT && (
        <Link to="/dokarti">Browse Jobs</Link>
      )}
      {role === USER_ROLES.COMPANY && (
        <Link to="/company/dashboard">Company Dashboard</Link>
      )}
      {role === USER_ROLES.ADMIN && (
        <Link to="/admin/dashboard">Admin Panel</Link>
      )}
    </nav>
  );
};
```

## 🔄 Automatic Role-Based Redirects

The system automatically redirects users based on their role:

1. **After Login/Registration**: Users are redirected to their role-appropriate dashboard
2. **Accessing Root Route**: Authenticated users are redirected to their default page
3. **Route Protection**: Users trying to access unauthorized routes are redirected

## 🧪 Testing Different Roles

For testing purposes, you can easily switch user roles:

1. Go to Clerk Dashboard
2. Find your test user
3. Update the `publicMetadata` → `role` value
4. Refresh your application
5. User will be automatically redirected to the appropriate dashboard

## 🚦 Error Handling

The system includes comprehensive error handling:

- **Loading States**: Users see loading indicators while authentication loads
- **Unauthorized Access**: Users are redirected to appropriate pages
- **Role Fallback**: Users without roles default to "student"
- **Route Fallback**: Unknown routes redirect to home page

## 📱 Components Overview

### Core Components

1. **RoleBasedRedirect**: Handles automatic redirects after authentication
2. **RoleProtectedRoute**: Protects routes based on user roles
3. **CompanyDashboard**: Dashboard for company users
4. **AdminDashboard**: Admin control panel
5. **DokartiHomepage**: Student job search interface

### Utility Functions

- `getUserRole(user)` - Get user's role
- `hasPermission(user, permission)` - Check specific permissions
- `getDefaultRoute(user)` - Get default route for user's role
- `canAccessRoute(user, route)` - Check route access

## 🔧 Configuration

All role configurations are centralized in `src/utils/roleUtils.js`:

- **USER_ROLES**: Define available roles
- **ROLE_ROUTES**: Default routes for each role
- **ROLE_PERMISSIONS**: Permissions for each role

## 🚀 Production Deployment

For production:

1. **Set up role assignment logic** in your backend
2. **Configure Clerk webhooks** to handle user registration
3. **Implement role assignment UI** for admins
4. **Test all role transitions** thoroughly
5. **Set up proper error monitoring**

## 📝 Adding New Roles

To add a new role:

1. Add to `USER_ROLES` in `roleUtils.js`
2. Define permissions in `ROLE_PERMISSIONS`
3. Add default route in `ROLE_ROUTES`
4. Create role-specific components
5. Update routing in `App.jsx`
6. Update protection logic

Your role-based authentication system is now ready for production with secure, scalable user management!