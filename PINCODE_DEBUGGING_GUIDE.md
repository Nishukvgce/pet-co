# Pincode Persistence Debugging Guide

## Overview
The pincode field is displaying correctly in the UI (showing "560454") but is not persisting to the database. This document outlines the debugging steps to identify and fix the issue.

## Components Verified
✅ **User Entity**: Has pincode field with @Column(length = 6) annotation
✅ **ProfileController**: Handles pincode validation and calls user.setPincode()
✅ **UserService**: Simple save() method calls userRepository.save()
✅ **ProfileDTO**: Includes pincode field in response
✅ **Frontend**: Sends pincode in profile update requests
✅ **API Integration**: userApi.updateProfile sends data correctly

## Debugging Steps Added

### 1. Backend Debug Logging
Added debug logging to track pincode flow:
- **ProfileController**: Logs pincode processing and validation
- **UserService**: Logs save operations with pincode values

### 2. Frontend Debug Logging
Added debug logging to track data transmission:
- **handleUpdateProfile**: Logs pincode value being sent to backend

## Potential Issues & Solutions

### Issue 1: Database Migration Not Applied
**Symptom**: Pincode column doesn't exist in database
**Check**: Run the database verification script
```bash
mysql -u root -p petco < check_pincode_column.sql
```

**Fix**: Apply the migration if column is missing
```bash
mysql -u root -p petco < add_pincode_column.sql
```

### Issue 2: Backend Not Restarted
**Symptom**: Code changes not reflected in runtime
**Fix**: Rebuild and restart backend
```bash
cd backend
mvn clean install -DskipTests
# Restart your Spring Boot application
```

### Issue 3: Database Connection Issues
**Symptom**: No database errors but data not persisting
**Check**: Verify database connection in application.properties
**Fix**: Ensure correct database URL, username, and password

### Issue 4: Transaction Rollback
**Symptom**: Save operation called but data reverted
**Check**: Look for transaction-related errors in logs
**Fix**: Check for validation errors or exceptions after save

### Issue 5: Frontend Data Not Reaching Backend
**Symptom**: Backend logs don't show pincode processing
**Check**: Browser developer tools network tab for API calls
**Fix**: Verify request payload contains pincode field

## Testing Procedure

### 1. Check Database Schema
```sql
DESCRIBE users;
-- Should show pincode VARCHAR(6) column
```

### 2. Test Backend Directly
Use Postman or curl to test profile update:
```bash
curl -X PUT "http://localhost:8080/auth/profile?email=YOUR_EMAIL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "pincode": "560001"
  }'
```

### 3. Check Application Logs
After updating profile, check backend logs for debug messages:
- "DEBUG: ProfileController - Processing pincode: [560001]"
- "DEBUG: UserService - Saving user with pincode: 560001"
- "DEBUG: UserService - User saved with ID: X and pincode: 560001"

### 4. Verify Database Persistence
```sql
SELECT id, name, email, pincode FROM users WHERE email = 'YOUR_EMAIL';
```

## Debug Log Locations

### Backend Logs
- Console output when running Spring Boot
- Look for lines starting with "DEBUG: ProfileController" and "DEBUG: UserService"

### Frontend Logs
- Browser developer console
- Look for "DEBUG: Pincode being sent:" and "DEBUG: Profile updated response:"

## Next Steps

1. **Apply Database Migration** (if not done)
2. **Rebuild Backend** with debug logging
3. **Test Profile Update** and check logs
4. **Verify Database** has updated pincode values
5. **Check API Calls** in browser network tab

## Common Solutions

### If pincode column is missing:
```bash
mysql -u root -p petco < add_pincode_column.sql
```

### If backend changes not reflected:
```bash
cd backend
mvn clean install -DskipTests
# Restart Spring Boot application
```

### If frontend not sending data:
Check browser network tab for PUT request to `/auth/profile` with pincode in payload.

## Files Modified for Debugging

1. `ProfileController.java` - Added pincode processing debug logs
2. `UserService.java` - Added save operation debug logs  
3. `user-account-dashboard/index.jsx` - Added frontend debug logs
4. `check_pincode_column.sql` - Database verification script

## Contact Points

- Backend API endpoint: `PUT /auth/profile`
- Database table: `users.pincode`
- Frontend component: `ProfileManagement.jsx`
- Service layer: `UserService.save()`