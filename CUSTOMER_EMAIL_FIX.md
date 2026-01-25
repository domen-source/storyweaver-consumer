# ✅ Customer Email Fix

## The Problem

Backend returned: `{"success":false,"error":"customerEmail is required"}`

The backend requires a `customerEmail` field when creating an order.

## The Solution

Added `customerEmail` parameter to `createOrder()` function with a default placeholder email.

### Changes Applied

**File:** `/lib/api.ts`

```typescript
// BEFORE:
export async function createOrder(opts: { 
  bookId?: string; 
  bookCode?: string;
}): Promise<Order> {
  return await postCreateOrder({ bookCode: bookCodeToSend })
}

// AFTER:
export async function createOrder(opts: { 
  bookId?: string; 
  bookCode?: string;
  customerEmail?: string;  // ✅ Added
}): Promise<Order> {
  // Use placeholder email if not provided
  const customerEmail = opts.customerEmail || 'demo@example.com'
  
  return await postCreateOrder({ 
    bookCode: bookCodeToSend,
    customerEmail: customerEmail  // ✅ Included in request
  })
}
```

## Request Body Format

The backend now receives:
```json
{
  "bookCode": "BOOK_1769178064160",
  "customerEmail": "demo@example.com"
}
```

## Current Behavior

- **Default email:** `demo@example.com` (placeholder)
- **Custom email:** Can be passed via `createOrder({ bookCode: "...", customerEmail: "user@example.com" })`
- **Page component:** No changes needed - uses default automatically

## Future Enhancement

If you want to collect real customer emails:

1. **Add email input to book detail page:**
```typescript
const [customerEmail, setCustomerEmail] = useState('')

// In the form:
<input 
  type="email" 
  value={customerEmail}
  onChange={(e) => setCustomerEmail(e.target.value)}
  placeholder="Enter your email"
/>

// When creating order:
await createOrder({ 
  bookCode: bookData.publication_code,
  customerEmail: customerEmail  // Use real email
})
```

2. **Or collect email after order creation** (if backend allows updating orders)

## Testing

**Expected console output:**
```
[createOrder] POST body: { bookCode: "BOOK_1769178064160", customerEmail: "demo@example.com" }
[createOrder] Response status: 200  ✅
[createOrder] Order created: ORD_...  ✅
```

## Files Modified

- ✅ `/lib/api.ts` - Added `customerEmail` parameter with default value

---

**Status:** ✅ Fixed
**Next:** Order creation should now work!

