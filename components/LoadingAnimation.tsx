'use client'

import { useEffect, useState } from 'react'

interface LoadingAnimationProps {
  message?: string
  subtext?: string
  progress?: number
}

export default function LoadingAnimation({ message, subtext, progress }: LoadingAnimationProps) {
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
        {/* Book Icon with Pulse */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center animate-pulse">
          <svg className="w-10 h-10 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C10.07 4.5 8.32 5.13 6.96 6.19C6.96 6.19 6.96 6.19 6.96 6.19L3 4v14l3.96 2.19C8.32 18.87 10.07 18.5 12 18.5s3.68.37 5.04 1.43L21 18V4l-3.96 2.19C15.68 5.13 13.93 4.5 12 4.5zM11 16.5H6v-2h5v2zm0-4H6v-2h5v2zm7 4h-5v-2h5v2zm0-4h-5v-2h5v2z"/>
          </svg>
        </div>

        {/* Message */}
        <h3 className="text-xl font-semibold text-dark-blue mb-2">
          {message || 'Creating your characters...'}
        </h3>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-pink-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {progress !== undefined && (
          <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
        )}

        {progress === undefined && (
          <p className="text-sm text-gray-600">
            {subtext || 'This may take about 30 seconds, as we need to make sure they look amazing! ❤️'}
          </p>
        )}
      </div>
    </div>
  )
}

