# Quick Setup Guide

## ✅ Dependencies Installed

The project dependencies have been installed. You can now run the development server.

## 🚀 Start the Development Server

```bash
cd /Users/domen/pastel-book-maker
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `app/page.tsx` - Homepage with all sections
- `app/[bookId]/page.tsx` - Dynamic book detail pages
- `components/` - All React components
- `app/globals.css` - Global styles with Tailwind

## 🔍 Troubleshooting

If you still see the default Next.js page:

1. **Make sure you're in the correct directory:**
   ```bash
   cd /Users/domen/pastel-book-maker
   ```

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Verify the page file exists:**
   ```bash
   cat app/page.tsx
   ```
   Should show imports for HeroSection, ReviewsSection, etc.

4. **Check for TypeScript errors:**
   ```bash
   npm run build
   ```

## 🎨 What You Should See

- Red announcement banner at the top
- Hero section with "Personalized Storybooks That Spark Magic"
- Customer reviews carousel
- "Your Favourites" section with 3 book cards
- "How Magic Works" 3-step process

