'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fetchBooks, formatPrice, Book } from '@/lib/api'
import PaymentModal from './PaymentModal'

export default function FavouritesSection() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({})

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
            ⭐ The Perfect Gift for your Loved Ones ⭐
          </p>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-[#B5C9A8] border-t-[#6B8F5E] rounded-full animate-spin"></div>
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
            ⭐ The Perfect Gift for your Loved Ones ⭐
          </p>
          <div className="bg-[#F0F4E8] border border-[#B5C9A8] rounded-2xl p-8 max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto mb-4 text-[#6B8F5E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#5A7F4D] font-medium mb-4">{error}</p>
            <button
              onClick={loadBooks}
              className="bg-[#6B8F5E] hover:bg-[#5A7F4D] text-white px-6 py-2 rounded-full transition-all font-medium hover:shadow-lg"
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
    <section id="favorites" className="pt-2 pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-4 text-gray-900">
          Your Favorites
        </h2>
        <p className="text-center text-gray-600 mb-6 text-lg">
          ⭐ The Perfect Gift for your Loved Ones ⭐
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
                {/* Book Cover */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-pastel-blue to-pastel-pink">
                  {/* Badges */}
                  {index === 0 && (
                    <>
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-[#6B8F5E] text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
                          ⭐ #1 Book in the USA ⭐
                        </div>
                      </div>
                      <motion.div 
                        className="absolute bottom-24 right-2 z-10"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-base font-bold shadow-lg border-2 border-white">
                          BEST
                        </div>
                      </motion.div>
                    </>
                  )}
                  {index === 1 && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-[#6B8F5E] text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
                        ⭐ Perfect Gift for Grandparents ⭐
                      </div>
                    </div>
                  )}
                  
                  <Image 
                    src={book.preview_image_url}
                    alt={book.title}
                    width={400}
                    height={533}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="px-6 pb-6 pt-3">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {index === 0 ? 371 : 100 + index * 47} reviews
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold font-display text-gray-900 mb-2 transition-colors">
                    {book.display_name || book.title}
                  </h3>

                  {/* Description */}
                  <div className="mb-4">
                    <p className={`text-gray-600 text-sm ${expandedBooks[book.id] ? '' : 'line-clamp-2'}`}>
                      {book.description}
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedBooks(prev => ({ ...prev, [book.id]: !prev[book.id] }))
                      }}
                      className="text-[#6B8F5E] text-xs font-semibold mt-1 hover:underline focus:outline-none"
                    >
                      {expandedBooks[book.id] ? 'less' : 'more'}
                    </button>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div className="text-3xl md:text-4xl font-medium text-gray-600">
                      ${formatPrice(book.price_cents)}
                    </div>
                    <Link 
                      href={`/books/${book.publication_code}`}
                      className="bg-white border-2 border-[#6B8F5E] text-[#6B8F5E] hover:bg-[#F0F4E8] px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all text-sm"
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

      {/* Payment Modal */}
      {selectedBook && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false)
            setSelectedBook(null)
          }}
          book={selectedBook}
        />
      )}
    </section>
  )
}
