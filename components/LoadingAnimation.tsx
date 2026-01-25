'use client'

import { useEffect, useState } from 'react'

interface LoadingAnimationProps {
  message?: string
  progress?: number
}

export default function LoadingAnimation({ message, progress }: LoadingAnimationProps) {
  const rotatingMessages = [
    "Your ink is drying...",
    "Your avatars are coming to life...",
    "Sprinkling magic dust...",
    "Painting your story...",
    "Almost there..."
  ]

  const [messageIndex, setMessageIndex] = useState(0)
  const [dotCount, setDotCount] = useState(1)

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % rotatingMessages.length)
    }, 3000)

    const dotInterval = setInterval(() => {
      setDotCount(prev => (prev % 3) + 1)
    }, 500)

    return () => {
      clearInterval(messageInterval)
      clearInterval(dotInterval)
    }
  }, [])

  const displayMessage = message || rotatingMessages[messageIndex]
  const dots = '.'.repeat(dotCount)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        {/* Spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 border-4 border-pink-600 rounded-full border-t-transparent animate-spin animation-delay-150" style={{ animationDirection: 'reverse' }}></div>
        </div>

        {/* Message */}
        <p className="text-xl font-semibold text-dark-blue mb-4">
          {displayMessage}
          {!message && <span className="inline-block w-4">{dots}</span>}
        </p>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {progress !== undefined && (
          <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
        )}

        {progress === undefined && (
          <p className="text-sm text-gray-600">This may take about 30 seconds...</p>
        )}
      </div>
    </div>
  )
}

