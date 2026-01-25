'use client'

import { useState } from 'react'
import Image from 'next/image'
import PersonalizationForm from './PersonalizationForm'

interface BookDetailProps {
  book: {
    title: string
    subtitle: string
    badge: string
    description: string
    price: string
    features: string[]
    details: string[]
    coverImage: string
    previewImages: string[]
    characters: Array<{
      label: string
      placeholder: string
      photoLabel: string
    }>
  }
  bookId: string
}

export default function BookDetail({ book, bookId }: BookDetailProps) {
  const [selectedPreview, setSelectedPreview] = useState(0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Column - Book Preview */}
      <div>
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-blue mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">{book.subtitle}</p>
          
          {/* Badge */}
          <div className="inline-block bg-blue-600 text-white text-sm font-bold py-1 px-4 rounded-full mb-6">
            ★ {book.badge} ★
          </div>
        </div>

        {/* Main Book Cover */}
        <div className="relative mb-6 bg-pastel-blue rounded-lg p-8">
          <div className="relative aspect-[3/4]">
            <Image
              src={book.previewImages[selectedPreview] || book.coverImage}
              alt={book.title}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Preview Thumbnails */}
        {book.previewImages.length > 0 && (
          <div className="flex gap-4">
            {book.previewImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedPreview(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedPreview === index
                    ? 'border-pink-500 scale-110'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={img}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column - Product Info & Form */}
      <div>
        {/* CTA Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-lg mb-6 transition-colors shadow-lg">
          Create Book Now
        </button>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {book.features.map((feature, idx) => (
            <p key={idx} className="text-gray-700">{feature}</p>
          ))}
        </div>

        {/* Details */}
        <div className="space-y-1 mb-6">
          {book.details.map((detail, idx) => (
            <p key={idx} className="text-gray-600">{detail}</p>
          ))}
        </div>

        {/* Price */}
        <p className="text-3xl font-bold text-blue-600 mb-8">
          Price: <span className="text-4xl">{book.price}</span>
        </p>

        {/* Personalization Form */}
        <PersonalizationForm characters={book.characters} bookId={bookId} />
      </div>
    </div>
  )
}

