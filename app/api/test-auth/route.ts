import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('=== AUTH TEST START ===');
  
  // Test environment variables first
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  
  console.log('Environment check:');
  console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:', clerkPublishableKey ? '✓ SET' : '✗ MISSING');
  console.log('CLERK_SECRET_KEY:', clerkSecretKey ? '✓ SET' : '✗ MISSING');
  
  const results = {
    environmentVars: {
      publishableKey: !!clerkPublishableKey,
      secretKey: !!clerkSecretKey
    },
    authMethods: {}
  };
  
  // Test auth()
  try {
    console.log('Testing auth()...');
    const authResult = auth();
    console.log('Auth() success:', {
      userId: authResult?.userId,
      hasUser: !!authResult?.user
    });
    results.authMethods.auth = {
      success: true,
      userId: authResult?.userId || null,
      hasUser: !!authResult?.user
    };
  } catch (error) {
    console.log('Auth() error:', error.message);
    results.authMethods.auth = {
      success: false,
      error: error.message
    };
  }
  
  // Test currentUser()
  try {
    console.log('Testing currentUser()...');
    const currentUserResult = await currentUser();
    console.log('CurrentUser() success:', {
      id: currentUserResult?.id,
      email: currentUserResult?.emailAddresses?.[0]?.emailAddress
    });
    results.authMethods.currentUser = {
      success: true,
      id: currentUserResult?.id || null,
      email: currentUserResult?.emailAddresses?.[0]?.emailAddress || null
    };
  } catch (error) {
    console.log('CurrentUser() error:', error.message);
    results.authMethods.currentUser = {
      success: false,
      error: error.message
    };
  }
  
  console.log('=== AUTH TEST COMPLETE ===');
  return NextResponse.json(results);
}
