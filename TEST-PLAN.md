
# Auth Decoupling Test Plan

## Overview

This test plan verifies the decoupling of Sagebright frontend from Supabase by shifting all auth and context hydration to a single backend endpoint.

## Prerequisites

- Backend `/api/auth/session` endpoint implemented
- Frontend code updated to use new auth system
- No direct Supabase client imports in the frontend

## Test Cases

### 1. Frontend Build Verification

- **Test**: Run `npm run build` and verify no TypeScript errors
- **Expected**: Build completes successfully with 0 errors
- **Verification**: Check for Supabase references in the build output
  ```sh
  grep -i supabase dist | wc -l
  # Expected: 0
  ```

### 2. Authentication Flow Tests

#### 2.1 Login Flow

- **Test**: Login with valid credentials
- **Expected**: 
  - User is authenticated
  - AuthContext is populated with `session`, `user`, `org` data
  - `ready` flag is set to `true`
- **Verification**: Check browser console and AuthDebug component

#### 2.2 Session Persistence

- **Test**: Refresh the page after login
- **Expected**: 
  - User remains logged in
  - AuthContext is populated from backend endpoint
  - No direct Supabase calls in network tab
- **Verification**: Check network requests and AuthDebug component

#### 2.3 Logout Flow

- **Test**: Click logout
- **Expected**: 
  - User is logged out
  - Session is cleared
  - User is redirected to login page
- **Verification**: Check cookies and AuthDebug component

### 3. Route Protection Tests

#### 3.1 Protected Route Access

- **Test**: Navigate to `/ask-sage` when authenticated
- **Expected**: Access is granted, page loads correctly
- **Verification**: Check browser console for errors

#### 3.2 Unauthenticated Access Redirect

- **Test**: Navigate to `/ask-sage` when not authenticated
- **Expected**: User is redirected to login page
- **Verification**: Check URL redirection and browser console

#### 3.3 Session Expiration Handling

- **Test**: Simulate session expiration
- **Expected**: User is redirected to login page
- **Verification**: Manually expire session or wait for expiration

### 4. Error Handling Tests

#### 4.1 Backend Unavailable

- **Test**: Disable backend endpoint and attempt login
- **Expected**: 
  - Appropriate error message displayed
  - System doesn't break
- **Verification**: Check UI feedback and console errors

#### 4.2 Invalid Session

- **Test**: Tamper with auth cookie and refresh page
- **Expected**: 
  - Session is rejected
  - User is logged out
  - User is redirected to login page
- **Verification**: Check browser console and redirection

### 5. Context Hydration Tests

#### 5.1 User Context Loading

- **Test**: Login and check user context data
- **Expected**: 
  - User data is loaded from auth endpoint
  - No direct Supabase database calls
- **Verification**: Check network requests and browser console

#### 5.2 Organization Context Loading

- **Test**: Login and check organization context data
- **Expected**: 
  - Organization data is loaded from auth endpoint
  - No direct Supabase database calls
- **Verification**: Check network requests and browser console

## Edge Cases

1. **Test**: Login from a different device
   - **Expected**: Session is properly created on new device

2. **Test**: Try accessing with expired token
   - **Expected**: User is properly redirected to login page

3. **Test**: API rate limiting test
   - **Expected**: System handles rate limits gracefully

## Pass Criteria

1. All functionality works exactly as before
2. No Supabase client code remains in frontend bundle
3. All auth/context is managed through backend endpoint
4. TypeScript builds with 0 errors
5. `/ask-sage` renders without direct Supabase fetch
6. User experience remains identical

## Reporting

Document any issues encountered with:
- Detailed steps to reproduce
- Expected vs actual behavior
- Browser console logs
- Network request logs
