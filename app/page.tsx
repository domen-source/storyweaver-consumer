import HeroSection from '@/components/HeroSection'
import ReviewsSection from '@/components/ReviewsSection'
import FavouritesSection from '@/components/FavouritesSection'
import HowMagicWorks from '@/components/HowMagicWorks'
import AnnouncementBanner from '@/components/AnnouncementBanner'

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnnouncementBanner />
      <HeroSection />
      <ReviewsSection />
      <FavouritesSection />
      <HowMagicWorks />
    </main>
  )
}
