# ✅ createOrder Function Fix - Returns Order Object

## Problem

The `createOrder()` function was returning `undefined` because it tried to access `data.order`, but the API returns a different structure:

**API Response:**
```json
{
  "success": true,
  "orderId": "e6cd2974-134b-4789-95f2-82b00a0b81bb",
  "status": "pending"
}
```

**Error:**
- `POST .../orders/undefined/upload-photo` - order.id was undefined
- Console: `[createOrder] Order created: undefined`

## Root Cause

The code was trying to extract:
```typescript
const order = data?.order ?? data  // ❌ data.order doesn't exist
```

But the API returns `orderId` directly in the response, not nested in an `order` property.

## Solution Applied

### 1. ✅ Fixed `postCreateOrder()` Function

**File:** `/lib/api.ts`

**Before (WRONG):**
```typescript
const data = text ? JSON.parse(text) : null
const order = data?.order ?? data  // ❌ Returns undefined
return order as Order
```

**After (CORRECT):**
```typescript
const data = text ? JSON.parse(text) : null
console.log('[createOrder] Parsed response data:', data)

if (!data || !data.orderId) {
  throw new Error('Invalid order response: missing orderId')
}

// Construct Order object from API response
const order: Order = {
  id: data.orderId,  // ✅ Extract orderId from response
  order_number: data.orderId,
  book_id: body.bookCode as string || '',
  status: data.status || 'pending',
  characters_data: null,
  avatars_generated: false,
  preview_generated: false,
  pages_generated: 0,
  total_pages: 0,
}

console.log('[createOrder] Created order object:', order)
console.log('[createOrder] Order ID:', order.id)
return order
```

### 2. ✅ Updated Order Interface

**File:** `/lib/api.ts`

**Before:**
```typescript
export interface Order {
  id: number  // ❌ API returns UUID string
  // ...
}
```

**After:**
```typescript
export interface Order {
  id: string | number  // ✅ Accepts UUID string or number
  // ...
}
```

### 3. ✅ Updated All Function Signatures

Updated all functions that accept `orderId` to accept `string | number`:

- ✅ `uploadPhoto(orderId: string | number, ...)`
- ✅ `generateAvatars(orderId: string | number)`
- ✅ `generatePreview(orderId: string | number)`
- ✅ `getOrderStatus(orderId: string | number)`
- ✅ `getOrderPages(orderId: string | number)`
- ✅ `generateFullBook(orderId: string | number)`

## API Response Structure

### Create Order Response
```json
{
  "success": true,
  "orderId": "e6cd2974-134b-4789-95f2-82b00a0b81bb",
  "status": "pending"
}
```

### Constructed Order Object
```typescript
{
  id: "e6cd2974-134b-4789-95f2-82b00a0b81bb",  // ✅ From data.orderId
  order_number: "e6cd2974-134b-4789-95f2-82b00a0b81bb",
  book_id: "BOOK_1769178064160",
  status: "pending",
  characters_data: null,
  avatars_generated: false,
  preview_generated: false,
  pages_generated: 0,
  total_pages: 0
}
```

## Testing

**Expected Console Output:**
```
[createOrder] POST body: { bookCode: "BOOK_...", customerEmail: "demo@example.com" }
[createOrder] Response status: 200
[createOrder] Response body: {"success":true,"orderId":"e6cd2974-...","status":"pending"}
[createOrder] Parsed response data: { success: true, orderId: "e6cd2974-...", status: "pending" }
[createOrder] Created order object: { id: "e6cd2974-...", ... }
[createOrder] Order ID: e6cd2974-134b-4789-95f2-82b00a0b81bb  ✅
[BookPage] Order created: e6cd2974-134b-4789-95f2-82b00a0b81bb  ✅
```

**Expected Behavior:**
- ✅ Order object is created with `id` property set
- ✅ `order.id` is available for uploads
- ✅ `uploadPhoto(order.id, ...)` works correctly
- ✅ No more "undefined" errors

## Files Modified

1. ✅ `/lib/api.ts`
   - Fixed `postCreateOrder()` to extract `orderId` from response
   - Updated `Order` interface to accept string IDs
   - Updated all function signatures to accept `string | number` for orderId

## Key Changes

1. **Extract `orderId` from response:**
   ```typescript
   id: data.orderId  // ✅ Correct extraction
   ```

2. **Construct full Order object:**
   ```typescript
   const order: Order = {
     id: data.orderId,
     order_number: data.orderId,
     status: data.status || 'pending',
     // ... other required fields
   }
   ```

3. **Type safety:**
   - Order interface accepts `string | number` for ID
   - All functions accept `string | number` for orderId
   - Works with both UUID strings and numeric IDs

---

**Status:** ✅ Fixed
**Linter Errors:** ✅ None
**Result:** Order object now properly created with `id` property

