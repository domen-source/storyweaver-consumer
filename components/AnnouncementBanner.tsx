'use client'

import { useState, useEffect } from 'react'

export default function AnnouncementBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 19, minutes: 10, seconds: 13 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
          if (minutes < 0) {
            minutes = 59
            hours--
            if (hours < 0) {
              hours = 23
            }
          }
        }
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="px-3 py-2 sm:px-4 sm:py-3 bg-[#6B8F5E]">
      <p className="mx-auto max-w-5xl text-center text-base font-semibold text-white sm:text-lg md:text-xl leading-tight">
        ✨ Limited Time Offer: <span className="font-extrabold">20% OFF</span> your first personalized book!{' '}
        Use code: <span className="ml-1 font-extrabold tracking-wide">MAGIC20</span>
        <span className="ml-2 inline-block font-medium text-white/95">
          Ends in {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </p>
    </div>
  )
}
