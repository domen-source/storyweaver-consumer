# API Integration Guide

## Setup

### 1. Environment Variables

Create `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### 2. Start Both Services

**Terminal 1 - Backend API:**
```bash
cd /path/to/backend
npm run dev
# Should run on http://localhost:3002
```

**Terminal 2 - Frontend:**
```bash
cd /Users/domen/pastel-book-maker
rm -rf .next
npm run dev
# Should run on http://localhost:3001
```

## Complete User Flow

### 1. Homepage → Browse Books
- **URL**: `http://localhost:3001/`
- **API Call**: `GET /api/public/books`
- **Action**: Displays all active books from the database
- **User Action**: Click "CREATE HERE" on any book

### 2. Book Detail → Upload Photos
- **URL**: `http://localhost:3001/books/[publication_code]`
- **API Calls**:
  - `GET /api/public/books/[code]` - Fetch book details
  - `POST /api/public/orders` - Create new order
  - `POST /api/public/orders/[orderId]/upload-photo` - Upload each photo
- **Features**:
  - Dynamic character upload fields based on book template
  - Real-time photo upload with preview
  - Upload validation (all photos required)
  - "Generate Avatars" button (enabled when ready)

### 3. Avatar Generation → Create Characters
- **API Call**: `POST /api/public/orders/[orderId]/generate-avatars`
- **Duration**: ~30 seconds
- **UI**: Loading animation with message "Creating your characters..."
- **Then**: Automatically generates preview

### 4. Preview Generation → Create Book Preview
- **API Call**: `POST /api/public/orders/[orderId]/generate-preview`
- **Duration**: ~30 seconds
- **UI**: Loading animation with message "Personalizing your book..."
- **Result**: Redirects to preview page

### 5. Preview Page → View Sample Pages
- **URL**: `http://localhost:3001/preview/[orderId]`
- **API Calls**:
  - `GET /api/public/orders/[orderId]/pages` - Fetch pages
  - `GET /api/public/orders/[orderId]/status` - Get order status
- **Features**:
  - First 3 pages displayed at full resolution
  - Remaining pages shown as blurred placeholders
  - Page navigation controls
  - "Get Full Book - $39.99" button

### 6. Payment Modal → Dummy Payment
- **UI**: Modal with payment button
- **Action**: Simulates 2-second payment processing
- **Result**: Triggers full book generation

### 7. Full Book Generation → Generate All Pages
- **API Call**: `POST /api/public/orders/[orderId]/generate-pages`
- **Polling**: `GET /api/public/orders/[orderId]/status` (every 2 seconds)
- **Duration**: ~30 seconds for remaining pages
- **UI**: Progress bar showing pages generated
- **Formula**: `progress = (pagesGenerated / totalPages) * 100`

### 8. Final Book View → Download Pages
- **API Call**: `GET /api/public/orders/[orderId]/pages` (refreshed)
- **Features**:
  - All pages displayed without blur
  - Full page navigation
  - "Download All" button (downloads all images)

## API Endpoints Reference

### Public Endpoints

```typescript
// Get all books
GET /api/public/books
Response: Book[]

// Get single book
GET /api/public/books/:publicationCode
Response: Book

// Create order
POST /api/public/orders
Body: { book_id: number }
Response: Order

// Upload photo
POST /api/public/orders/:orderId/upload-photo
Body: FormData { photo: File, character_name: string }
Response: { message: string, photo_url: string }

// Generate avatars
POST /api/public/orders/:orderId/generate-avatars
Response: { message: string }

// Generate preview
POST /api/public/orders/:orderId/generate-preview
Response: { message: string }

// Get order status
GET /api/public/orders/:orderId/status
Response: Order { pages_generated, total_pages, ... }

// Get order pages
GET /api/public/orders/:orderId/pages
Response: OrderPage[]

// Generate full book
POST /api/public/orders/:orderId/generate-pages
Response: { message: string }
```

## TypeScript Interfaces

See `/lib/api.ts` for complete interface definitions:
- `Book`
- `Order`
- `OrderPage`

## Components Created

### Page Components
- `/app/books/[code]/page.tsx` - Book detail with photo uploads
- `/app/preview/[orderId]/page.tsx` - Preview and full book viewer

### Reusable Components
- `/components/LoadingAnimation.tsx` - Loading states with optional progress
- `/components/PaymentModal.tsx` - Dummy payment interface
- `/components/PageViewer.tsx` - Page navigation and display
- `/components/FavouritesSection.tsx` - Updated to fetch from API

### Utility
- `/lib/api.ts` - All API functions and TypeScript interfaces

## Testing Flow

1. Start backend on port 3002
2. Start frontend on port 3001
3. Navigate to `http://localhost:3001`
4. Click on a book
5. Upload photos for all characters
6. Click "Generate Avatars & Preview"
7. Wait for generation (loading animation)
8. View preview pages
9. Click "Get Full Book"
10. Click "Pay $39.99" (simulated)
11. Wait for full book generation (progress bar)
12. View all pages and download

## Error Handling

All API calls include try-catch error handling with:
- Console error logging
- User-friendly error messages
- Retry buttons where appropriate
- Loading state management

## Notes

- All API calls use the environment variable `NEXT_PUBLIC_API_URL`
- Images are loaded directly from the backend using returned URLs
- Photo uploads happen immediately after selection
- Progress polling stops after 60 seconds as a safety measure
- Payment is simulated with a 2-second delay

