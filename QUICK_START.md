# 🚀 Quick Start Guide

## ✅ Integration Complete!

Your frontend is now fully connected to your backend API at `http://localhost:3002`.

## Start Both Services

### Terminal 1: Backend
```bash
cd /path/to/your/backend
npm run dev
# Should show: Server running on http://localhost:3002
```

### Terminal 2: Frontend
```bash
cd /Users/domen/pastel-book-maker
npm run dev
# Should show: Ready on http://localhost:3001
```

## Test the Complete Flow

1. **Open**: `http://localhost:3001`
2. **See**: Books loaded from your database
3. **Click**: Any book → navigates to `/books/[publication_code]`
4. **Upload**: Photos for all characters (e.g., Dad, Child)
5. **Click**: "Generate Avatars & Preview" button
6. **Wait**: ~60 seconds (avatar + preview generation)
7. **View**: First 3 pages unlocked, others blurred
8. **Click**: "Get Full Book - $39.99"
9. **Pay**: Click "Pay $39.99" in modal (simulated)
10. **Wait**: ~30 seconds (full book generation with progress bar)
11. **Download**: All pages now unlocked + download button

## What's New

### Routes Created
- `/books/[code]` - Dynamic book detail with uploads
- `/preview/[orderId]` - Preview and full book viewer

### Components Created
- `LoadingAnimation` - Loading states with progress
- `PaymentModal` - Dummy payment interface
- `PageViewer` - Page navigation and display

### API Integration
- All API calls in `/lib/api.ts`
- TypeScript interfaces for type safety
- Error handling throughout
- Loading states everywhere

## File Structure

```
pastel-book-maker/
├── .env.local                    # API URL config
├── lib/
│   └── api.ts                   # API functions + interfaces
├── app/
│   ├── page.tsx                 # Homepage (unchanged)
│   ├── books/[code]/page.tsx    # NEW: Book detail + uploads
│   ├── preview/[orderId]/       # NEW: Preview + full book
│   └── [bookId]/page.tsx        # OLD: Still works for backward compat
└── components/
    ├── LoadingAnimation.tsx     # NEW
    ├── PaymentModal.tsx         # NEW
    ├── PageViewer.tsx           # NEW
    └── FavouritesSection.tsx    # UPDATED: Now uses API
```

## Verify Everything Works

```bash
# Check backend is running
curl http://localhost:3002/api/public/books

# Should return JSON with books
```

## Troubleshooting

### Books not loading?
- Check backend is running on port 3002
- Check `.env.local` exists with correct API URL
- Check browser console for errors

### Default Next.js page?
```bash
cd /Users/domen/pastel-book-maker
rm -rf .next
npm run dev
```

### Upload not working?
- Check backend accepts file uploads
- Check backend storage is configured
- Check network tab in browser DevTools

## Documentation

- `COMPLETE_INTEGRATION.md` - Full technical documentation
- `API_INTEGRATION.md` - API endpoints reference
- `START_PROJECT.md` - Detailed startup guide
- `TROUBLESHOOTING.md` - Common issues

## The Flow in Detail

```
Homepage (API fetch books)
    ↓
Book Detail (Upload photos)
    ↓
Avatar Generation (30s loading)
    ↓
Preview Generation (30s loading)
    ↓
Preview Page (3 pages unlocked)
    ↓
Payment Modal (Dummy payment)
    ↓
Full Book Generation (30s with progress)
    ↓
Complete Book (Download all pages)
```

## Next Steps

1. ✅ Backend running on 3002
2. ✅ Frontend running on 3001
3. ✅ Test the complete flow
4. 🎉 Everything should work!

## Need Help?

Check the documentation files or look at:
- Browser console (F12) for frontend errors
- Backend terminal for API errors
- Network tab to see API requests

---

**Ready to go!** Just start both services and open `http://localhost:3001`

