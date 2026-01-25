# 🔍 Order Creation Error (400) - Debug Guide

## What I Fixed

### Problem
The page was showing `"Failed to create order: 400"` but **hiding the actual backend error message**.

The book loads correctly (proof: "Tamara testing" displays), but when the page tries to create an order, it gets HTTP 400 (Bad Request).

### Solution Applied

**1. Enhanced `createOrder()` to show REAL backend error:**

**File:** `/lib/api.ts`

```typescript
// BEFORE (BAD):
if (!response.ok) {
  const errorText = await response.text()
  console.error('[createOrder] Error:', errorText)
  throw new Error(`Failed to create order: ${response.status}`)  // ❌ Hides errorText!
}

// AFTER (GOOD):
if (!response.ok) {
  const errorText = await response.text()
  console.error('[createOrder] Error:', errorText)
  throw new Error(`Failed to create order: ${response.status} - ${errorText}`)  // ✅ Shows backend message!
}
```

**2. Added support for both `publication_code` AND `book_id`:**

Many public APIs prefer `publication_code` over internal numeric `book_id`. The new version tries both:

```typescript
// NEW signature:
export async function createOrder(opts: { 
  bookId?: number; 
  publicationCode?: string 
}): Promise<Order>

// Tries publication_code first:
await postCreateOrder({ publication_code: opts.publicationCode })

// Falls back to book_id if needed:
await postCreateOrder({ book_id: opts.bookId })
```

**3. Updated the call site to pass both values:**

**File:** `/app/books/[code]/page.tsx`

```typescript
// BEFORE:
const orderData = await createOrder(bookData.id)

// AFTER:
const orderData = await createOrder({ 
  publicationCode: bookData.publication_code, 
  bookId: bookData.id 
})
```

## How to Find the Real Error

### Step 1: Check Browser Console

After the fix, when you click a book card, the console will show:

```
[BookPage] Creating order for book: { id: 1, publication_code: "BOOK_1769178064160" }
[createOrder] Options: { publicationCode: "BOOK_1769178064160", bookId: 1 }
[createOrder] POST body: { publication_code: "BOOK_1769178064160" }
[createOrder] Response status: 400
[createOrder] Response body: {"error": "Missing required field: xyz"}  ← THE REAL ERROR!
```

### Step 2: Check Network Tab

1. Open DevTools (F12) → **Network** tab
2. Click a book card to load the detail page
3. Find the request: `POST /api/public/orders`
4. Click on it
5. Go to **Response** tab
6. **Read the actual error message**

Common backend errors:
- `"Missing required field: publication_code"` → Backend expects publication_code
- `"Missing required field: book_id"` → Backend expects book_id (number)
- `"book_id must be an integer"` → Type mismatch
- `"Invalid publication_code"` → Code doesn't match any book
- `"Book not found"` → Book exists but isn't active

### Step 3: Test API Directly

```bash
# Try with publication_code
curl -X POST http://localhost:3002/api/public/orders \
  -H "Content-Type: application/json" \
  -d '{"publication_code": "BOOK_1769178064160"}'

# Try with book_id
curl -X POST http://localhost:3002/api/public/orders \
  -H "Content-Type: application/json" \
  -d '{"book_id": 1}'

# Check what the backend says!
```

## Expected Request Bodies

The code now tries **BOTH** formats automatically:

### Format 1: publication_code (tries first)
```json
{
  "publication_code": "BOOK_1769178064160"
}
```

### Format 2: book_id (fallback)
```json
{
  "book_id": 1
}
```

## Possible Backend Requirements

Your backend might need:

### Option A: Just publication_code
```json
{
  "publication_code": "BOOK_1769178064160"
}
```

### Option B: Just book_id
```json
{
  "book_id": 1
}
```

### Option C: Additional fields
```json
{
  "publication_code": "BOOK_1769178064160",
  "customer_email": "user@example.com",  // Maybe required?
  "customer_name": "John Doe"             // Maybe required?
}
```

## Next Steps

1. **Restart your dev server** (to pick up code changes):
```bash
cd /Users/domen/pastel-book-maker
npm run dev
```

2. **Click a book card** and watch the console

3. **Read the actual error message** from:
   - Browser console log
   - Network tab → Response

4. **Share the exact backend error message** with me and I'll fix it immediately

## Files Changed

- ✅ `/lib/api.ts` - Enhanced `createOrder()` with better error messages and dual-format support
- ✅ `/app/books/[code]/page.tsx` - Updated to pass both `publicationCode` and `bookId`

---

**Status:** ✅ Applied
**Next:** Test and check console for the REAL backend error message

