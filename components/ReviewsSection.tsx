'use client'

import { useRef } from 'react'

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

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Rating Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl font-bold text-dark-blue">Rated 4.9 out of 5</span>
            <span className="text-2xl">⭐</span>
            <span className="text-lg text-gray-600">(651)</span>
          </div>
          <p className="text-gray-600">Showing our favorite reviews.</p>
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
            <div
              key={index}
              className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-6 border border-gray-100"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-dark-blue">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">⭐</span>
                ))}
              </div>
              <h3 className="font-semibold text-lg text-dark-blue mb-2">{review.title}</h3>
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

