# API Response Formats

## Important: Response Structure

The backend API has specific formats you need to handle correctly:

1. **Arrays are wrapped in objects** (e.g., `{ "books": [...] }`)
2. **Prices are in cents** (e.g., `price_cents: 3999` = $39.99)

### ✅ Correct Format

#### Price Handling
```typescript
// API returns price in cents
{
  "price_cents": 3999  // $39.99
}

// Convert to dollars for display
import { formatPrice } from '@/lib/api'
const displayPrice = formatPrice(book.price_cents)  // "39.99"

// Or manually:
const price = (book.price_cents / 100).toFixed(2)  // "39.99"
```

#### Get All Books
```typescript
GET /api/public/books

Response:
{
  "books": [
    {
      "id": 1,
      "publication_code": "worlds-greatest-dad",
      "title": "The World's Greatest Dad",
      // ... other fields
    }
  ]
}

// In code:
const data = await response.json()
const books = data.books || []  // Extract the array
```

#### Get Single Book
```typescript
GET /api/public/books/:code

Response: Book object (not wrapped)
{
  "id": 1,
  "publication_code": "worlds-greatest-dad",
  // ... other fields
}

// In code:
const book = await response.json()
```

### ❌ Common Error

```typescript
// WRONG - Will cause "books.map is not a function"
const data = await response.json()
setBooks(data)  // data is { books: [...] }, not an array!

// CORRECT
const data = await response.json()
setBooks(data.books || [])  // Extract the array
```

## API Response Formats Reference

### Books Endpoints

```typescript
// GET /api/public/books
{
  "books": Book[]
}

// GET /api/public/books/:code
Book
```

### Orders Endpoints

```typescript
// POST /api/public/orders
Order

// POST /api/public/orders/:id/upload-photo
{
  "message": string,
  "photo_url": string
}

// POST /api/public/orders/:id/generate-avatars
{
  "message": string
}

// POST /api/public/orders/:id/generate-preview
{
  "message": string
}

// GET /api/public/orders/:id/status
Order

// GET /api/public/orders/:id/pages
OrderPage[]

// POST /api/public/orders/:id/generate-pages
{
  "message": string
}
```

## Error Handling

All API functions in `/lib/api.ts` now include:

1. ✅ Response status check (`response.ok`)
2. ✅ Error message extraction
3. ✅ Type-safe response parsing
4. ✅ Null/empty array fallbacks

## Updated Files

### Array Wrapping Fix
- `/lib/api.ts` - Fixed `fetchBooks()` to extract `data.books`
- `/components/FavouritesSection.tsx` - Added better error handling
- TypeScript interface `BooksResponse` added for type safety

### Price Format Fix
- `/lib/api.ts` - Updated `Book` interface: `price_cents` instead of `price_usd`
- `/lib/api.ts` - Added `formatPrice()` utility function
- `/components/FavouritesSection.tsx` - Using `formatPrice(book.price_cents)`
- `/app/books/[code]/page.tsx` - Using `formatPrice(book.price_cents)`

## Testing

To verify the fix works:

```bash
# 1. Start backend
cd /path/to/backend
npm run dev

# 2. Test API directly
curl http://localhost:3002/api/public/books

# Should return:
# {"books":[...]}

# 3. Start frontend
cd /Users/domen/pastel-book-maker
npm run dev

# 4. Open browser
# http://localhost:3001
# Books should load without "map is not a function" error
```

