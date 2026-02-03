'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fetchBooks, formatPrice, Book } from '@/lib/api'

export default function FavouritesSection() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchBooks()
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected array of books')
      }
      
      setBooks(data)
      
      if (data.length === 0) {
        setError('No books available yet')
      }
    } catch (err) {
      console.error('Error loading books:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load books'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="pt-2 pb-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 text-center mb-4">
            Your Favorites
          </h2>
          <p className="text-center text-gray-600 mb-6 text-lg">
            Rated 4.9 out of 5 ⭐ by thousands of happy families
          </p>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error && books.length === 0) {
    return (
      <section className="pt-2 pb-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
            Your Favorites
          </h2>
          <p className="text-center text-gray-600 mb-6 text-lg">
            Rated 4.9 out of 5 ⭐ by thousands of happy families
          </p>
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-8 max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto mb-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-pink-600 font-medium mb-4">{error}</p>
            <button
              onClick={loadBooks}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full transition-all font-medium hover:shadow-lg"
            >
              Try Again
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Make sure the backend API is running on port 3002
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-2 pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-4 text-gray-900">
          Your Favorites
        </h2>
        <p className="text-center text-gray-600 mb-6 text-lg">
          Rated 4.9 out of 5 ⭐ by thousands of happy families
        </p>

        {/* Book Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              className="group cursor-pointer relative"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Bestseller Badge - show for first book */}
                {index === 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      ⭐ #1 Book in the USA ⭐
                    </div>
                  </div>
                )}

                {/* Book Cover */}
                <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-pastel-blue to-pastel-pink">
                  <Image 
                    src={book.preview_image_url} 
                    alt={book.title}
                    width={400}
                    height={533}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {100 + index * 47} reviews
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold font-display text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                    {book.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {book.description}
                  </p>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">
                      ${formatPrice(book.price_cents)}
                    </div>
                    <Link 
                      href={`/books/${book.publication_code}`}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all text-sm"
                    >
                      Create Here
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
