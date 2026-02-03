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
    <div className="px-3 py-4 sm:px-4 sm:py-5 bg-gradient-to-r from-pink-400/70 via-rose-400/60 to-orange-300/70">
      <p className="mx-auto max-w-5xl rounded-2xl border border-white/35 bg-white/20 px-4 py-3 text-center text-base font-semibold text-white shadow-[0_8px_30px_rgba(236,72,153,0.28)] backdrop-blur-xl sm:text-lg md:text-xl">
        ✨ Limited Time Offer: <span className="font-extrabold">20% OFF</span> your first personalized book!{' '}
        Use code: <span className="ml-1 rounded-lg border border-white/45 bg-white/30 px-3 py-1 font-extrabold tracking-wide">MAGIC20</span>
        <span className="ml-2 inline-block font-medium text-white/95">
          Ends in {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </p>
    </div>
  )
}
