'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const reviews = [
  {
    name: 'Sarah M.',
    date: 'January 15',
    rating: 5,
    title: 'Absolutely Beautiful!',
    comment: 'The quality exceeded my expectations. My partner loved it!',
  },
  {
    name: 'James K.',
    date: 'January 12',
    rating: 5,
    title: 'Perfect Anniversary Gift',
    comment: 'Brought tears to my wife\'s eyes. Worth every penny.',
  },
  {
    name: 'Emily R.',
    date: 'January 10',
    rating: 5,
    title: 'Amazing Quality',
    comment: 'The illustrations are so cute and the book feels premium.',
  },
  {
    name: 'Michael T.',
    date: 'January 8',
    rating: 5,
    title: 'Highly Recommend!',
    comment: 'Fast delivery and the personalization was spot on.',
  },
  {
    name: 'Lisa P.',
    date: 'January 5',
    rating: 5,
    title: 'Great Experience :)',
    comment: 'So easy to customize. The result was stunning!',
  },
  {
    name: 'David W.',
    date: 'January 3',
    rating: 5,
    title: 'My Girlfriend Loved It',
    comment: 'The best gift I\'ve ever given. She was so surprised!',
  },
]

export default function ReviewsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const scrollInterval = setInterval(() => {
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
      
      if (scrollContainer.scrollLeft >= maxScroll) {
        // Reset to beginning
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        // Scroll to the right by one card width
        scrollContainer.scrollBy({ left: 344, behavior: 'smooth' }) // 320px card + 24px gap
      }
    }, 3000) // Scroll every 3 seconds

    return () => clearInterval(scrollInterval)
  }, [])

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Rating Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl md:text-4xl font-bold font-display text-gray-900">Rated 4.9 out of 5</span>
            <span className="text-3xl">⭐</span>
          </div>
          <p className="text-gray-600 text-lg">(651) Showing our favorite reviews</p>
        </div>

        {/* Reviews Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
          }}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              style={{ scrollSnapAlign: 'start' }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold font-display text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#6B8F5E] flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0)}
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <h3 className="font-bold font-display text-lg text-gray-900 mb-2">{review.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
