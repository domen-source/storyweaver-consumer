'use client'

import { useState } from 'react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPayment: () => void
  amount: number
}

export default function PaymentModal({ isOpen, onClose, onPayment, amount }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    onPayment()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-blue mb-4">Complete Your Purchase</h2>
          
          <div className="mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              ${amount.toFixed(2)}
            </div>
            <p className="text-gray-600">One-time payment for your personalized book</p>
          </div>

          <div className="bg-pastel-blue rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-dark-blue mb-2">What you get:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>✓ High-quality personalized storybook</li>
              <li>✓ 15 beautifully illustrated pages</li>
              <li>✓ Hard binding, 12" x 12" square</li>
              <li>✓ Fast delivery within days</li>
              <li>✓ Made in the USA</li>
            </ul>
          </div>

          {isProcessing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600">Processing payment...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                Pay ${amount.toFixed(2)}
              </button>
              <button
                onClick={onClose}
                className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4">
            This is a demo payment. No actual charge will be made.
          </p>
        </div>
      </div>
    </div>
  )
}

