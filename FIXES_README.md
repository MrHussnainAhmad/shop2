# Bug Fixes and Solutions

This document outlines the fixes applied to resolve the three main issues in the application.

## Problem 1: "User not found" even when logged in

### Root Cause
- The address API routes had inconsistent user lookup logic
- GET route only looked up users by clerkId from URL parameters
- POST route had fallback logic but GET route didn't
- set-default route used email instead of clerkId

### Fixes Applied
1. **Updated GET route** (`app/api/addresses/route.ts`):
   - Now uses auth() to get current user instead of relying on URL parameters
   - Added fallback logic to find user by email if clerkId lookup fails
   - Auto-updates clerkId if user is found by email

2. **Fixed set-default route** (`app/api/addresses/set-default/route.ts`):
   - Changed from using email to clerkId for user lookup
   - Updated frontend to only pass addressId parameter

3. **Added comprehensive logging** to all address routes for better debugging

## Problem 2: Users unable to upload addresses

### Root Causes
- Unique constraints on UserProfile model were too strict
- Potential duplicate users in database causing conflicts
- Schema validation issues

### Fixes Applied
1. **Updated UserProfile schema** (`models/UserProfile.js` and `models/UserProfile.ts`):
   - Added `sparse: true` to unique constraints for clerkId and email
   - This allows null/undefined values while maintaining uniqueness for existing values

2. **Created cleanup script** (`scripts/cleanup-users.js`):
   - Analyzes database for duplicate users
   - Provides recommendations for manual cleanup
   - Can be run with: `node scripts/cleanup-users.js`

3. **Enhanced error handling** in address creation with detailed logging

## Problem 3: Admin can't upload banners from /admin/banner

### Root Causes
- Missing authentication on banner API routes
- Image upload API missing authentication
- Middleware not properly configured for admin routes

### Fixes Applied
1. **Added authentication to banner APIs**:
   - `pages/api/banners/index.js`: Auth required for POST operations
   - `pages/api/banners/[id].js`: Auth required for PUT/DELETE operations
   - `pages/api/upload/image.js`: Auth required for image uploads

2. **Updated middleware** (`middleware.ts`):
   - Added public routes for essential functionality
   - Properly configured route matching

3. **Enhanced error messages** to clearly indicate authentication requirements

## How to Test the Fixes

### 1. Test Address Functionality
```bash
# Start the development server
npm run dev

# Sign in to your account
# Go to /account/addresses
# Try adding a new address
# Check browser console for detailed logs
```

### 2. Test Admin Banner Upload
```bash
# Make sure you're signed in as an admin user
# Go to /admin/banner
# Try uploading a banner image
# Check that the banner saves successfully
```

### 3. Run Database Cleanup (if needed)
```bash
# Create .env.local with your MONGODB_URI
# Run the cleanup script
node scripts/cleanup-users.js
```

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Fill in your actual environment variables:
   - MongoDB connection string
   - Clerk authentication keys
   - Cloudinary credentials (for image upload)
   - Stripe keys (for payments)

## Additional Debugging

### Enable Detailed Logging
The address routes now have extensive logging. Check your server console for:
- User lookup attempts
- Database queries
- Address creation/update operations
- Authentication status

### Common Issues and Solutions

1. **"User not found" errors**:
   - Check if user exists in database
   - Verify clerkId matches between Clerk and database
   - Run cleanup script to identify duplicates

2. **Authentication errors**:
   - Ensure you're signed in to Clerk
   - Check environment variables are set correctly
   - Verify middleware configuration

3. **Image upload failures**:
   - Check Cloudinary credentials
   - Ensure user is authenticated
   - Check browser network tab for detailed error messages

## Database Monitoring

To monitor your database and user creation:

```javascript
// Check user count
db.userprofiles.countDocuments()

// Find users with missing clerkId
db.userprofiles.find({clerkId: {$exists: false}})

// Find duplicate emails
db.userprofiles.aggregate([
  {$group: {_id: "$email", count: {$sum: 1}}},
  {$match: {count: {$gt: 1}}}
])
```

## Next Steps

1. Test all functionality thoroughly
2. Monitor logs for any remaining issues
3. Clean up any duplicate users in database
4. Consider adding admin role checking for better security
5. Set up proper error monitoring in production

## Support

If you encounter any issues after applying these fixes:
1. Check the server console logs
2. Check browser console for client-side errors
3. Verify environment variables are set correctly
4. Run the database cleanup script
5. Ensure you're using the latest code changes
