'use client'

import { useEffect, useState } from 'react'

interface LoadingAnimationProps {
  message?: string
  subtext?: string
  progress?: number
  variant?: 'characters' | 'preview'
}

export default function LoadingAnimation({ message, subtext, progress, variant = 'characters' }: LoadingAnimationProps) {
  const characterSteps = [
    "Turning photos into illustrated characters",
    "Shaping smiles, eyes, and expressions",
    "Adding warmth and personality",
    "Bringing your characters to life"
  ]

  const previewSteps = [
    "Placing your characters into the story 👩‍👧",
    "Creating the first pages of your book 📖",
    "Bringing the pages to life 🌟",
    "Personalized preview is almost ready ❤️"
  ]

  const rotatingSteps = variant === 'preview' ? previewSteps : characterSteps

  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    setStepIndex(0) // Reset when variant changes
    
    const stepInterval = setInterval(() => {
      setStepIndex(prev => {
        // Stop at the last step
        if (prev >= rotatingSteps.length - 1) {
          return prev
        }
        return prev + 1
      })
    }, 7000)

    return () => {
      clearInterval(stepInterval)
    }
  }, [variant, rotatingSteps.length])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        {/* Spinning Loader */}
        <div className="mx-auto mb-6 w-16 h-16">
          <svg className="w-16 h-16 animate-spin text-[#6B8F5E]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-dark-blue mb-4">
          {message || 'Creating your characters...'}
        </h3>

        {/* Rotating Step Text */}
        <p className="text-[#6B8F5E] font-semibold text-lg mb-2 transition-opacity duration-300">
          {rotatingSteps[stepIndex]}
        </p>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-[#6B8F5E] h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {progress !== undefined && (
          <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
        )}

        {progress === undefined && (
          <p className="text-sm text-gray-500 mt-2">
            {variant === 'preview' 
              ? 'This process takes about 30 seconds, hang on tight! ❤️'
              : (subtext || 'This may take about 30 seconds ✨')
            }
          </p>
        )}
      </div>
    </div>
  )
}

