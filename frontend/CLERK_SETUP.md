# Clerk Authentication Setup for Kandra

This project now uses Clerk for user authentication, replacing the custom login/signup forms with professional authentication components.

## 🚀 Setup Instructions

### 1. Clerk Dashboard Configuration

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or use your existing one
3. Copy your **Publishable Key** from the API Keys section
4. Update the `.env` file with your actual key:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### 2. Authentication Routes

The application now supports these authentication routes:

- `/login` - Sign in page with Cryptonext design
- `/register` - Sign up page with Cryptonext design  
- `/sign-in` - Alternative sign in route (redirects to `/login`)
- `/sign-up` - Alternative sign up route (redirects to `/register`)

### 3. Features Implemented

✅ **Cryptonext Design Integration**
- Custom styling for Clerk components
- Maintains the original Cryptonext aesthetic
- 3D crypto illustration on both login/signup pages
- Responsive design for all screen sizes

✅ **Authentication Protection**
- Protected routes using Clerk's `<SignedIn>` component
- Automatic redirects for unauthenticated users
- Seamless user experience

✅ **Navbar Integration**
- User profile display with avatar/initials
- User dropdown menu with profile info
- Sign out functionality
- Click-outside to close menu

✅ **Social Authentication**
- Google authentication
- Apple authentication  
- Wallet authentication (crypto-themed)
- Email/password authentication

### 4. User Experience

**Login Flow:**
1. User visits `/login`
2. Sees Cryptonext-styled login form
3. Can authenticate via email/password or social providers
4. Redirected to `/dokarti` after successful login

**Signup Flow:**
1. User visits `/register`
2. Sees Cryptonext-styled signup form
3. Creates account with email/password or social providers
4. Redirected to `/dokarti` after successful registration

**Protected Access:**
1. User tries to access protected route (e.g., `/dashboard`)
2. If not authenticated, automatically shown sign-in form
3. After authentication, redirected to intended page

### 5. Customization

The Clerk components are customized with:

- **Colors:** Blue/purple gradient theme matching Kandra branding
- **Typography:** Consistent font weights and sizes
- **Layout:** Proper spacing and responsive design
- **Buttons:** Custom styling for primary actions and social auth
- **Form Fields:** Styled inputs with proper focus states

### 6. Development

To run the application:

```bash
npm run dev
```

Make sure you have:
- Valid Clerk publishable key in `.env`
- All dependencies installed (`npm install`)
- Vite development server running

### 7. Production Deployment

For production:
1. Set your production Clerk publishable key
2. Configure your Clerk application with your production domain
3. Update redirect URLs in Clerk dashboard
4. Build and deploy: `npm run build`

## 🔐 Security Features

- **JWT-based authentication** managed by Clerk
- **Secure session management** with automatic token refresh
- **Social OAuth integration** with proper security standards
- **Email verification** and password reset flows
- **HTTPS-only cookies** and secure token storage

## 📱 Mobile Responsive

The authentication pages are fully responsive and work seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎨 Design Consistency

The authentication flow maintains:
- Kandra branding and color scheme
- Cryptonext 3D illustration style
- Professional UI/UX standards
- Smooth animations and transitions
- Accessible design patterns

Your authentication system is now production-ready with enterprise-level security and a beautiful user experience!