'use client'

import { useState } from 'react'
import { Book, formatPrice } from '@/lib/api'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  book: Book
}

export default function PaymentModal({ isOpen, onClose, book }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const amount = parseFloat(formatPrice(book.price_cents))

  const handlePayment = async () => {
    try {
      setIsProcessing(true)
      setError(null)

      // Call API to create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookTitle: book.title,
          bookDescription: book.description,
          priceInCents: book.price_cents,
          bookId: book.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()

      // Redirect to Stripe Checkout
      if (!url) {
        throw new Error('No checkout URL returned')
      }

      window.location.href = url
    } catch (err) {
      console.error('Payment error:', err)
      setError(err instanceof Error ? err.message : 'Payment failed')
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Purchase</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{book.title}</h3>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              ${amount.toFixed(2)}
            </div>
            <p className="text-gray-600">One-time payment for your personalized book</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">What you get:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>✓ High-quality personalized storybook</li>
              <li>✓ Beautifully illustrated pages</li>
              <li>✓ Premium quality binding</li>
              <li>✓ Fast delivery</li>
              <li>✓ 100% satisfaction guaranteed</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {isProcessing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600">Redirecting to secure checkout...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                Proceed to Payment - ${amount.toFixed(2)}
              </button>
              <button
                onClick={onClose}
                className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-4">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-gray-500">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

