'use client'

import { useState } from 'react'
import Image from 'next/image'
import { OrderPage } from '@/lib/api'

interface PageViewerProps {
  pages: OrderPage[]
  isPreview?: boolean
}

export default function PageViewer({ pages, isPreview = false }: PageViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1)
  }

  const handleDownloadAll = () => {
    pages.forEach((page, index) => {
      const link = document.createElement('a')
      link.href = page.imageUrl
      link.download = `page-${page.pageNumber}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No pages available yet.</p>
      </div>
    )
  }

  const page = pages[currentPage]
  const unlocked = !isPreview ? true : (page.isPreview ?? (currentPage < 3))

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Display */}
      <div className="relative bg-white rounded-lg shadow-xl p-4 mb-6">
        <div className="relative aspect-square">
          {page.imageUrl ? (
            <Image
              src={page.imageUrl}
              alt={`Page ${page.pageNumber + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className={`object-contain ${!unlocked ? 'blur-md' : ''}`}
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400">Page {page.pageNumber + 1}</p>
            </div>
          )}
          {!unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 text-center shadow-xl">
                <svg
                  className="w-16 h-16 mx-auto mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="font-semibold text-dark-blue">Preview Only</p>
                <p className="text-sm text-gray-600">Purchase to unlock all pages</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="text-center">
          <p className="text-lg font-semibold text-dark-blue">
            Page {currentPage + 1} / {pages.length}
          </p>
          {isPreview && (
            <p className="text-sm text-gray-600">
              {unlocked ? 'Preview' : 'Locked'}
            </p>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === pages.length - 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === pages.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {pages.map((page, index) => {
          const thumbUnlocked = !isPreview ? true : (page.isPreview ?? (index < 3))
          return (
            <button
              key={page.pageNumber}
              onClick={() => setCurrentPage(index)}
              className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                currentPage === index ? 'border-blue-600 scale-105' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {page.imageUrl ? (
                <Image
                  src={page.imageUrl}
                  alt={`Page ${page.pageNumber + 1}`}
                  fill
                  sizes="96px"
                  className={`object-cover ${!thumbUnlocked ? 'blur-sm' : ''}`}
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <p className="text-xs text-gray-400">{page.pageNumber + 1}</p>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                {page.pageNumber + 1}
              </div>
              {!thumbUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Download Button */}
      {!isPreview && (
        <button
          onClick={handleDownloadAll}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download All Pages
        </button>
      )}
    </div>
  )
}

