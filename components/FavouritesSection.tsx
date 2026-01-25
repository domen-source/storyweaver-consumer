'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-blue text-center mb-12">
            Your Favourites
          </h2>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error && books.length === 0) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-blue mb-12">
            Your Favourites
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={loadBooks}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
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
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-dark-blue text-center mb-12">
          Your Favourites
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
            >
              {/* Book Cover */}
              <div className="relative">
                {/* Badge Banner */}
                <div className="absolute top-2 left-0 right-0 z-10">
                  <div className="bg-blue-600 text-white text-xs font-bold py-1 px-3 inline-block rounded-r-full">
                    ★ #1 BOOK IN THE USA ★
                  </div>
                </div>

                {/* Book Image */}
                <div className="relative h-64 bg-pastel-blue">
                  <Image
                    src={book.cover_image_url}
                    alt={book.title}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                {/* Status Badge */}
                {book.is_active && (
                  <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-lg font-bold text-sm">
                    NEW
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark-blue mb-2">{book.title}</h3>
                <p className="text-blue-600 text-sm font-medium mb-3 uppercase">{book.subtitle}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{book.description}</p>

                {/* Features */}
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-700">⭐ Perfect personalized gift</p>
                  <p className="text-sm text-gray-700">⭐ Created with Love, Delivered Fast and Made in the USA.</p>
                </div>

                {/* Price */}
                <p className="text-2xl font-bold text-blue-600 mb-4">${formatPrice(book.price_cents)}</p>

                {/* CTA Button */}
                <Link
                  href={`/books/${book.publication_code}`}
                  className="block w-full text-center border-2 border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  CREATE HERE
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
