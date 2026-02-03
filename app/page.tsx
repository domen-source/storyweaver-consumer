import HeroSection from '@/components/HeroSection'
import ReviewsSection from '@/components/ReviewsSection'
import FavouritesSection from '@/components/FavouritesSection'
import HowMagicWorks from '@/components/HowMagicWorks'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import CommunityPhotosSection from '@/components/CommunityPhotosSection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnnouncementBanner />
      <HeroSection />
      <HowMagicWorks />
      <FavouritesSection />
      <CommunityPhotosSection />
      <ReviewsSection />
    </main>
  )
}
