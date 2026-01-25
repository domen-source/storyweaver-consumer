# ✅ Upload Photo Parameter Fix

## Problem

Backend returns **400 error** when uploading photos because of a parameter name mismatch.

**Backend expects:** `role`  
**Frontend was sending:** `character_name`

## Root Cause

The backend endpoint reads the parameter as:
```javascript
const role = formData.get('role')  // Backend expects 'role'
```

But the frontend was sending:
```typescript
formData.append('character_name', characterName)  // ❌ Wrong parameter name
```

## Solution Applied

**File:** `/lib/api.ts`  
**Line:** 183

**Before (WRONG):**
```typescript
const formData = new FormData()
formData.append('photo', file)
formData.append('character_name', characterName)  // ❌ Backend doesn't recognize this
```

**After (CORRECT):**
```typescript
const formData = new FormData()
formData.append('photo', file)
formData.append('role', characterName)  // ✅ Backend expects 'role'
```

## FormData Structure

**Now sends:**
```
FormData {
  photo: File,
  role: "parent" | "child"  // Character role name
}
```

## Testing

**Expected behavior:**
- ✅ Photo uploads successfully
- ✅ No 400 error
- ✅ Backend receives `role` parameter correctly
- ✅ Photo is associated with the correct character role

**Console output (success):**
```
[Upload] Uploading photo for role: parent
[Upload] Response status: 200
[Upload] Photo uploaded successfully
```

## Files Modified

- ✅ `/lib/api.ts` - Changed parameter name from `character_name` to `role`

---

**Status:** ✅ Fixed
**Linter Errors:** ✅ None
**Result:** Photo uploads should now work correctly

