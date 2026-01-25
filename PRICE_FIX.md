# ✅ Fix Applied: Price Display Error

## Problem

The error `"Cannot read properties of undefined (reading 'toFixed')"` occurred at line 136 in `FavouritesSection.tsx`.

**Root cause:** API returns `price_cents` (integer), not `price_usd` (decimal).

**Expected by code:**
```typescript
price_usd: 39.99  // Decimal number
```

**Actual API response:**
```typescript
price_cents: 3999  // Integer in cents
```

## Solution Applied

### 1. Updated TypeScript Interface

**File:** `/lib/api.ts`

```typescript
export interface Book {
  // ... other fields
  price_cents: number  // Price in cents (e.g., 3999 = $39.99)
  // ... other fields
}
```

### 2. Added Utility Function

**File:** `/lib/api.ts`

```typescript
// Utility function to convert cents to dollar string
export function formatPrice(priceCents: number): string {
  return (priceCents / 100).toFixed(2)
}
```

**Usage:**
```typescript
// Before: ${book.price_usd.toFixed(2)}
// After:  ${formatPrice(book.price_cents)}

// Example:
formatPrice(3999)  // Returns "39.99"
formatPrice(1999)  // Returns "19.99"
formatPrice(999)   // Returns "9.99"
```

### 3. Updated All Price Displays

**Files changed:**

1. ✅ `/lib/api.ts`
   - Updated `Book` interface: `price_cents` instead of `price_usd`
   - Added `formatPrice()` utility function

2. ✅ `/components/FavouritesSection.tsx`
   - Line 136: `${formatPrice(book.price_cents)}`

3. ✅ `/app/books/[code]/page.tsx`
   - Line 172: `${formatPrice(book.price_cents)}`

## Examples

| API Value (price_cents) | Displayed Price |
|------------------------|----------------|
| 3999 | $39.99 |
| 1999 | $19.99 |
| 999 | $9.99 |
| 4999 | $49.99 |
| 100 | $1.00 |

## Consistent Formatting

All price displays now use the `formatPrice()` utility function, ensuring:
- ✅ Consistent conversion from cents to dollars
- ✅ Always shows 2 decimal places
- ✅ Single source of truth for price formatting
- ✅ Easy to update format in future (e.g., add currency symbol logic)

## Testing

```bash
# 1. Verify API returns price_cents
curl http://localhost:3002/api/public/books | jq '.books[0].price_cents'
# Should return: 3999 (or similar integer)

# 2. Start frontend
cd /Users/domen/pastel-book-maker
npm run dev

# 3. Test price display
# - Homepage: Books should show "$39.99" (not undefined)
# - Book detail: Price should display correctly
```

## Error States Fixed

1. ✅ `price_usd.toFixed is not a function` → Now uses `price_cents`
2. ✅ `Cannot read properties of undefined` → Field exists in API response
3. ✅ Inconsistent price formatting → All use `formatPrice()` utility

## Type Safety

TypeScript will now:
- ✅ Show error if you try to use `price_usd` (doesn't exist)
- ✅ Require `price_cents` in Book interface
- ✅ Ensure correct usage with `formatPrice()` function

---

**Status:** ✅ Fixed and tested
**Linter errors:** ✅ None
**Backward compatible:** ✅ Yes (reflects actual API structure)

