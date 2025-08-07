# Diagnostic Steps for Authentication Issues

## Step 1: Check Environment Variables

Since Node.js might not be in your PATH, you can check your environment variables manually:

1. Open `.env.local` in VS Code
2. Verify these variables are set and have values:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `MONGODB_URI`

## Step 2: Check Browser Authentication Status

1. Open your browser and go to your Next.js app
2. Open browser Developer Tools (F12)
3. Go to Console tab
4. Type this command and press Enter:

```javascript
console.log('User signed in:', !!window.Clerk?.user);
console.log('User ID:', window.Clerk?.user?.id);
```

## Step 3: Test Authentication API Directly

1. Make sure you're signed in to your app in the browser
2. Open a new browser tab and go to: `http://localhost:3000/api/test-auth`
3. Check what this returns - it should show your authentication status

## Step 4: Check Network Requests

1. Go to your address page: `http://localhost:3000/account/addresses`
2. Open Developer Tools → Network tab
3. Try to add an address
4. Look for the POST request to `/api/addresses`
5. Check:
   - Request Headers (should include authentication cookies)
   - Response (check if it's 401 or other error)

## Step 5: Check Server Logs

If you can run the development server:

1. Open command prompt or PowerShell in your project directory
2. Try running: `npx next dev`
3. If that doesn't work, try: `.\node_modules\.bin\next dev`
4. Watch the console output when you try to add an address

## Step 6: Quick Fixes to Try

### Fix 1: Restart Development Server
Sometimes environment variables don't reload properly.

### Fix 2: Check Sign-in Status
Make sure you're actually signed in:
1. Go to your app
2. Check if you see a user menu or sign-in button
3. If signed out, sign in again

### Fix 3: Clear Browser Storage
1. Open Developer Tools → Application tab (Chrome) or Storage tab (Firefox)
2. Clear all cookies and localStorage for your domain
3. Sign in again

### Fix 4: Check Clerk Dashboard
1. Go to https://dashboard.clerk.com/
2. Check your app settings
3. Verify the domain settings match your local development URL

## Expected Results

When everything is working:
- Browser console shows `User signed in: true`
- `/api/test-auth` returns success for both auth methods
- POST to `/api/addresses` returns 201 (success) instead of 401

## If Nothing Works

The issue might be:

1. **Environment variables not loading**: Check if `.env.local` is in the root directory
2. **Clerk keys incorrect**: Double-check your Clerk dashboard keys
3. **Middleware blocking requests**: The middleware might be preventing API access
4. **Browser not sending auth cookies**: Clear browser data and sign in again

## Emergency Workaround

If authentication keeps failing, we can temporarily modify the API to work without authentication for testing:

```typescript
// In app/api/addresses/route.ts - TEMPORARY WORKAROUND
export async function POST(request: NextRequest) {
  // Skip auth check temporarily
  const userId = "temp-user-id";
  const email = "test@example.com";
  
  // ... rest of the code
}
```

**Note: Only use this for testing - remove before production!**

Let me know what you find with these diagnostic steps!
