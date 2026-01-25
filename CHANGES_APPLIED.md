# ✅ Changes Applied - Order Creation Error Fix

## What Was Changed

### 1. Enhanced Error Reporting in `createOrder()`

**File:** `/lib/api.ts`

The function now:
- ✅ Shows the **actual backend error message** (not just "400")
- ✅ Tries `publication_code` first, then falls back to `book_id`
- ✅ Logs all request/response details for debugging

**Before:**
```typescript
throw new Error(`Failed to create order: ${response.status}`)
// Result: "Failed to create order: 400" ← Useless!
```

**After:**
```typescript
throw new Error(`Failed to create order: ${response.status} - ${text}`)
// Result: "Failed to create order: 400 - Missing required field: xyz" ← Useful!
```

### 2. Updated Function Signature

**New signature:**
```typescript
export async function createOrder(opts: { 
  bookId?: number; 
  publicationCode?: string 
}): Promise<Order>
```

**Logic:**
1. Try with `{ publication_code: "BOOK_..." }`
2. If that fails, try with `{ book_id: 1 }`
3. If both fail or no params provided, throw clear error

### 3. Updated Call Site

**File:** `/app/books/[code]/page.tsx`

```typescript
const orderData = await createOrder({ 
  publicationCode: bookData.publication_code,  // Try this first
  bookId: bookData.id                           // Fallback to this
})
```

## What You'll See Now

### In Browser Console (F12):

```
[BookPage] Creating order for book: { id: 1, publication_code: "BOOK_1769178064160" }
[createOrder] Options: { publicationCode: "BOOK_1769178064160", bookId: 1 }
[createOrder] POST body: { publication_code: "BOOK_1769178064160" }
[createOrder] Response status: 400
[createOrder] Response body: {"error": "ACTUAL BACKEND ERROR MESSAGE HERE"}  ← THIS IS KEY!
```

### In Network Tab (DevTools → Network):

1. Look for: `POST /api/public/orders`
2. Click on it
3. **Request** tab shows what we sent:
   ```json
   { "publication_code": "BOOK_1769178064160" }
   ```
4. **Response** tab shows what backend said:
   ```json
   { "error": "The actual reason why it failed" }
   ```

## Common Backend Errors and Solutions

### Error: "Missing required field: book_id"
**Meaning:** Backend needs numeric `book_id`, not `publication_code`

**Solution:** The code already tries `book_id` as fallback, but if backend rejects `publication_code` before trying book_id, I can switch the order.

### Error: "publication_code is required"
**Meaning:** Backend needs `publication_code` string

**Solution:** Already implemented! We send this first.

### Error: "Invalid publication_code"
**Meaning:** Code doesn't match any book in database

**Check:**
```bash
# Verify book exists
curl http://localhost:3002/api/public/books/BOOK_1769178064160
```

### Error: "Book must be active"
**Meaning:** Book exists but `is_active: false`

**Check:** In backend, verify book's `is_active` field is `true`

### Error: "Additional fields required"
**Meaning:** Backend needs more than just book identifier

**Example:** Might need customer info:
```json
{
  "publication_code": "BOOK_...",
  "customer_email": "user@example.com"
}
```

**Solution:** Once we know what's required, I'll add those fields

## Test Right Now

### 1. Restart Dev Server

```bash
cd /Users/domen/pastel-book-maker

# Stop current server (Ctrl+C)
npm run dev
```

### 2. Open Browser with DevTools

```bash
# Open browser to:
http://localhost:3001
```

**Press F12** to open DevTools **BEFORE** clicking any book!

### 3. Click a Book Card

1. Click "CREATE HERE" on any book
2. Watch the **Console** tab
3. Look for the log: `[createOrder] Response body: ...`
4. **Copy the entire error message and send it to me**

### 4. Alternative: Check Network Tab

1. DevTools → **Network** tab
2. Filter by: `orders`
3. Click a book card
4. Find: `POST orders`
5. Click it → **Response** tab
6. **Copy the response and send it to me**

## Why This Helps

The backend is telling us **exactly** what's wrong, but we were throwing it away!

Now we can see messages like:
- ❌ "Missing required field: customer_email"
- ❌ "publication_code format invalid"
- ❌ "Book not available for purchase"
- ❌ "Database connection error"

Once we see the real message, the fix is trivial!

## Files Modified

1. ✅ `/lib/api.ts`
   - Enhanced `createOrder()` with dual-format support
   - Added detailed logging
   - Surface real backend errors

2. ✅ `/app/books/[code]/page.tsx`
   - Pass both `publicationCode` and `bookId`
   - Better logging

---

**Next Step:** Check browser console and share the backend error message!

