import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-pastel-blue to-white py-16 px-4 overflow-hidden">
      {/* Background LOVE text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[200px] font-bold text-pastel-blue/20 select-none">LOVE</span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Books Image */}
        <div className="mb-6 flex justify-center">
          <Image
            src="https://pastel-book-maker.lovable.app/assets/hero-books-6xUUq94H.png"
            alt="Personalized storybooks collection"
            width={1285}
            height={857}
            className="object-contain"
            priority
          />
        </div>

        {/* Tagline */}
        <div className="mb-4">
          <span className="inline-block bg-pastel-blue/50 text-dark-blue px-4 py-2 rounded-full text-sm font-medium">
            Perfect gift for loved ones
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-blue mb-8">
          Personalized Storybooks That Spark Magic
        </h1>

        {/* CTA Button */}
        <Link
          href="/create"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
        >
          Create Your Book
        </Link>
      </div>
    </section>
  )
}

