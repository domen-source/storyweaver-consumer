# Pastel Book Maker

A Next.js 14 application for creating personalized children's storybooks. This is a recreation of the design from [pastel-book-maker.lovable.app](https://pastel-book-maker.lovable.app/).

## Features

- 🏠 **Homepage** with hero section, customer reviews, and featured books
- 📚 **Book Detail Pages** with personalization forms
- 🎨 **Modern Design** with pastel colors and clean UI
- 📱 **Responsive Layout** that works on all devices
- 🖼️ **Image Integration** with Next.js Image optimization

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - UI library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
pastel-book-maker/
├── app/
│   ├── [bookId]/          # Dynamic book detail pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── AnnouncementBanner.tsx
│   ├── BackButton.tsx
│   ├── BookDetail.tsx
│   ├── FavouritesSection.tsx
│   ├── HeroSection.tsx
│   ├── HowMagicWorks.tsx
│   ├── PersonalizationForm.tsx
│   └── ReviewsSection.tsx
├── public/                 # Static assets
└── ...config files
```

## Available Routes

- `/` - Homepage with featured books
- `/worlds-greatest-dad` - The World's Greatest Dad book detail
- `/two-goodest-pups` - Your Two Goodest Pups book detail
- `/family-story` - Our Family Story book detail

## Next Steps

- [ ] Connect to backend API for book data
- [ ] Implement photo upload functionality
- [ ] Add avatar creation flow
- [ ] Integrate payment processing
- [ ] Add user authentication
- [ ] Implement order tracking

## Notes

- Images are currently loaded from the original site. You may want to download and host them locally.
- The personalization form is ready for backend integration.
- All styling uses Tailwind CSS with custom colors defined in `tailwind.config.js`.

