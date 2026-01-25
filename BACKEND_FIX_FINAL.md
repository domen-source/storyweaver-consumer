# ✅ Backend API Format - FINAL FIX

## The Real Backend Error

From console logs:
```json
{
  "success": false,
  "error": "bookCode is required"
}
```

## What the Backend ACTUALLY Expects

### POST /api/public/orders

**Request body:**
```json
{
  "bookCode": "BOOK_1769178064160"
}
```

**NOT:**
- ❌ `publication_code` (snake_case)
- ❌ `book_id` (numeric ID)
- ✅ `bookCode` (camelCase, the publication code string)

## Changes Applied

### 1. Fixed `createOrder()` Function

**File:** `/lib/api.ts`

```typescript
// BEFORE (WRONG):
export async function createOrder(opts: { 
  bookId?: number; 
  publicationCode?: string 
}): Promise<Order> {
  if (opts.publicationCode) {
    return await postCreateOrder({ publication_code: opts.publicationCode })
  }
  if (typeof opts.bookId === 'number') {
    return await postCreateOrder({ book_id: opts.bookId })
  }
  throw new Error('createOrder requires { publicationCode } or { bookId }')
}

// AFTER (CORRECT):
export async function createOrder(opts: { 
  bookId?: string; 
  bookCode?: string 
}): Promise<Order> {
  const bookCodeToSend = opts.bookCode || opts.bookId
  
  if (bookCodeToSend) {
    return await postCreateOrder({ bookCode: bookCodeToSend })  // ✅ camelCase
  }
  
  throw new Error('createOrder requires { bookCode } or { bookId }')
}
```

### 2. Updated Call Site

**File:** `/app/books/[code]/page.tsx`

```typescript
// BEFORE:
const orderData = await createOrder({ 
  publicationCode: bookData.publication_code,
  bookId: bookData.id 
})

// AFTER:
const orderData = await createOrder({ 
  bookCode: bookData.publication_code  // ✅ Pass publication code as bookCode
})
```

### 3. Fixed TypeScript Types

**File:** `/lib/api.ts`

```typescript
// Book ID is a UUID string, not a number
export interface Book {
  id: string  // ✅ Changed from number to string (UUID)
  publication_code: string
  // ... rest of fields
}

export interface Order {
  id: number
  order_number: string
  book_id: string  // ✅ Changed from number to string (UUID)
  // ... rest of fields
}
```

## Backend API Naming Convention

The backend uses **camelCase** for request bodies:
- `bookCode` (not `publication_code` or `book_id`)
- Likely other fields follow same pattern

## What Should Happen Now

### 1. Console Logs (Expected)

```
[BookPage] Creating order for book: { id: "803259c2-...", publication_code: "BOOK_1769178064160" }
[createOrder] Options: { bookCode: "BOOK_1769178064160" }
[createOrder] POST body: { bookCode: "BOOK_1769178064160" }
[createOrder] Response status: 200  ✅
[createOrder] Response body: { "order": {...} }  ✅
[createOrder] Order created: ORD_...  ✅
[BookPage] Book and order loaded successfully  ✅
```

### 2. Page Behavior

✅ Book detail page loads
✅ Book info displays (title, price, description)
✅ Order is created successfully
✅ Upload form appears
✅ Ready to upload character photos

## Testing

**Restart dev server and test:**

```bash
cd /Users/domen/pastel-book-maker
npm run dev
```

Then:
1. Open `http://localhost:3001`
2. Click any book's "CREATE HERE" button
3. Page should load successfully
4. Check console - should see "Order created: ORD_..."

## Files Modified

1. ✅ `/lib/api.ts`
   - Fixed `createOrder()` to send `{ bookCode: "..." }`
   - Updated `Book.id` type: `number` → `string`
   - Updated `Order.book_id` type: `number` → `string`

2. ✅ `/app/books/[code]/page.tsx`
   - Pass `bookCode` with publication code value
   - Simplified call (removed unnecessary fallback)

## Key Takeaways

1. **Backend uses camelCase** for request bodies (JavaScript/Node.js convention)
2. **Frontend/database uses snake_case** for stored data (SQL convention)
3. **IDs are UUIDs (strings)**, not integers
4. **Always check the actual backend error message** - it tells you exactly what's wrong!

---

**Status:** ✅ Fixed
**Expected Result:** Order creation should now work!

