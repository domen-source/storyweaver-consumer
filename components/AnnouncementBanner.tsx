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
    <div className="bg-red-600 text-white text-center py-2 px-4">
      <p className="text-sm">
        Early Valentine&apos;s Deal: Use LOVE for 10% OFF for any personalized book. Valid{' '}
        <span className="font-semibold">
          {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </p>
    </div>
  )
}

