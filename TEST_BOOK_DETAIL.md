# 🧪 Test Book Detail Page

## Quick Test Steps

### 1. Restart Your Dev Server (Important!)

The `.env.local` variables are loaded at server start, so you need to restart:

```bash
cd /Users/domen/pastel-book-maker

# Stop current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Test Navigation from Homepage

1. Open browser: `http://localhost:3001`
2. Click any book's "CREATE HERE" button
3. Should navigate to: `http://localhost:3001/books/BOOK_1769178064160`

### 3. Expected Console Logs

Open browser DevTools (F12) → Console tab. You should see:

```
[API] Initialized with URL: http://localhost:3002
[API] Environment variable: http://localhost:3002
[BookPage] Loading book with code: BOOK_1769178064160
[fetchBook] Fetching book with code: BOOK_1769178064160
[fetchBook] API URL: http://localhost:3002
[fetchBook] Full URL: http://localhost:3002/api/public/books/BOOK_1769178064160
[fetchBook] Response status: 200 OK
[fetchBook] Data received: { book: {...} }
[fetchBook] Extracted book: { id: 1, title: "...", ... }
[BookPage] Book fetched successfully: The World's Greatest Dad
[createOrder] Creating order for book ID: 1
[createOrder] Response status: 200
[createOrder] Order created: ORD_...
[BookPage] Book and order loaded successfully
```

### 4. Expected Page Display

✅ Book title displayed
✅ Book price displayed (e.g., $39.99)
✅ Book description shown
✅ Character upload fields visible (Dad's Photo, etc.)
✅ Upload buttons visible
✅ "Generate Avatars" button visible (disabled until photos uploaded)

### 5. If You See Errors

#### Error: "Failed to load book"

**Check Console:**
- Look for `[fetchBook] Response status:` - should be `200`
- If status is 404: Backend is not running or wrong URL
- If status is 500: Backend error

**Fix:**
```bash
# Terminal 1: Make sure backend is running
cd /path/to/backend
npm run dev

# Should show: Server running on port 3002

# Terminal 2: Verify API works
curl http://localhost:3002/api/public/books/BOOK_1769178064160
```

#### Error: API_URL is undefined

**Fix:**
1. Check `.env.local` exists in `/Users/domen/pastel-book-maker/`
2. Verify it contains: `NEXT_PUBLIC_API_URL=http://localhost:3002`
3. Restart dev server (important!)

```bash
# Stop server (Ctrl+C)
cat .env.local  # Should show: NEXT_PUBLIC_API_URL=http://localhost:3002
npm run dev     # Restart
```

#### Error: "Invalid response format"

This means the API is not returning `{ "book": {...} }`

**Debug:**
```bash
# Test API directly
curl http://localhost:3002/api/public/books/BOOK_1769178064160

# Expected response format:
{
  "book": {
    "id": 1,
    "publication_code": "BOOK_1769178064160",
    "title": "...",
    ...
  }
}
```

### 6. Test Direct URL Access

Try accessing the book detail page directly:

```
http://localhost:3001/books/BOOK_1769178064160
```

Should load the book page immediately.

## Verification Checklist

- [ ] Backend running on port 3002
- [ ] Frontend running on port 3001
- [ ] `.env.local` exists and has correct API_URL
- [ ] Dev server restarted after creating `.env.local`
- [ ] Homepage loads and shows books
- [ ] Clicking "CREATE HERE" navigates to book page
- [ ] Book detail page loads without errors
- [ ] Console shows successful API calls
- [ ] Book info displays correctly

## Common Issues

### Port Already in Use

```bash
# Frontend (port 3001)
lsof -ti:3001 | xargs kill -9
npm run dev

# Backend (port 3002)
lsof -ti:3002 | xargs kill -9
cd /path/to/backend && npm run dev
```

### Cache Issues

```bash
cd /Users/domen/pastel-book-maker
rm -rf .next
npm run dev
```

### Network Tab Shows 404

1. Open DevTools → Network tab
2. Click book card
3. Look for request to `/api/public/books/BOOK_...`
4. If it shows 404: Backend is not running or wrong base URL
5. Check the full request URL matches: `http://localhost:3002/api/public/books/BOOK_...`

---

**After successful test, you can:**
1. Upload character photos
2. Generate avatars
3. Complete the full personalization flow

**Next Steps:** Test photo upload functionality

