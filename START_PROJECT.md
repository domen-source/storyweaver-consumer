# How to Start the Project

## Prerequisites
- Backend API running on `http://localhost:3002`
- Node.js installed
- Both services need to run simultaneously

## Quick Start

### Option 1: Automatic Script

```bash
cd /Users/domen/pastel-book-maker
./start-dev.sh
```

### Option 2: Manual Commands

```bash
# Navigate to project
cd /Users/domen/pastel-book-maker

# Clear Next.js cache (if needed)
rm -rf .next

# Start development server
npm run dev
```

The app will start on `http://localhost:3001` (or next available port if 3000 is taken)

## Verify Setup

Run the verification script:

```bash
cd /Users/domen/pastel-book-maker
node verify-setup.js
```

## Testing the Complete Flow

1. **Make sure backend is running** on port 3002
   ```bash
   curl http://localhost:3002/api/public/books
   ```
   Should return JSON with books

2. **Open frontend** at `http://localhost:3001`

3. **Test the flow**:
   - Homepage should show books from API
   - Click a book → should navigate to `/books/[code]`
   - Upload photos → should upload to backend
   - Generate avatars → should show loading animation
   - Preview pages → should show first 3 pages
   - Payment → should trigger full book generation
   - View all pages → should show complete book

## Common Issues

### "Default Next.js page appears"
```bash
cd /Users/domen/pastel-book-maker
rm -rf .next
npm run dev
```

### "Cannot fetch books"
- Check backend is running on port 3002
- Verify `.env.local` has correct API URL
- Check browser console for CORS errors

### "Photos won't upload"
- Check backend is accepting file uploads
- Verify backend storage is configured
- Check network tab in browser DevTools

### "Port already in use"
```bash
npm run dev -- -p 3001
```

## Environment Variables

Create `.env.local` if it doesn't exist:

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3002" > .env.local
```

## What You Should See

### Homepage
- Red announcement banner
- Hero section with books
- Customer reviews
- Live books from your database (via API)

### Book Detail Page
- Book information
- Character upload fields (dynamic based on book)
- Photo upload with preview
- "Generate Avatars" button

### Preview Page
- First 3 pages visible
- Remaining pages blurred
- "Get Full Book" button
- Payment modal

### Complete Book
- All pages visible
- Page navigation
- Download button

## Development Tips

- Check terminal for error messages
- Use browser console (F12) to see API calls
- Backend logs show API requests
- Photos uploaded to backend storage
- Orders are stored in database

## File Structure

```
pastel-book-maker/
├── .env.local              # API URL configuration
├── lib/
│   └── api.ts             # API functions
├── app/
│   ├── page.tsx           # Homepage
│   ├── books/[code]/      # Book detail pages
│   └── preview/[orderId]/ # Preview pages
└── components/
    ├── LoadingAnimation.tsx
    ├── PaymentModal.tsx
    ├── PageViewer.tsx
    └── FavouritesSection.tsx
```

