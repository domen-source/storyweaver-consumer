'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

// Floating decorative elements
const FloatingHeart = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute text-[#B5C9A8] ${className}`}
    animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  </motion.div>
)

const FloatingStar = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute text-yellow-300 ${className}`}
    animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  </motion.div>
)

const FloatingCloud = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute text-[#DCE4D0] ${className}`}
    animate={{ x: [0, 10, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg width="60" height="40" viewBox="0 0 60 40" fill="currentColor">
      <ellipse cx="20" cy="25" rx="15" ry="10"/>
      <ellipse cx="35" cy="20" rx="18" ry="12"/>
      <ellipse cx="45" cy="25" rx="12" ry="8"/>
    </svg>
  </motion.div>
)

const FloatingSparkle = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute text-[#8BAF7C] ${className}`}
    animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay }}
  >
    ✨
  </motion.div>
)

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F4E8] to-white pt-4 pb-12 md:pt-12 md:pb-20">
      {/* Animated background elements - positioned near the title */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingHeart className="bottom-52 left-[3%] md:left-[8%]" delay={0} />
        <FloatingStar className="bottom-48 right-[3%] md:right-[8%]" delay={0.5} />
        <FloatingSparkle className="bottom-60 left-[10%] md:left-[18%]" delay={0.3} />
        <FloatingSparkle className="bottom-52 right-[10%] md:right-[18%]" delay={1.2} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Book covers - 3 books floating/tilted */}
        <div className="flex justify-center items-center -mb-12 md:-mb-24 relative h-96 md:h-[500px] overflow-visible">
          {/* Book 1 - Center main book */}
          <motion.div 
            className="relative z-20"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="w-full md:w-[600px] h-auto">
              <img 
                src="/uploads/photos/Books_Website.gif" 
                alt="Book Cover" 
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>

        {/* Headline */}
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gray-900">Personalized</span> Storybooks That
            <span className="text-[#5A7F4D]">
              {" "}Spark Magic
            </span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Create unique, AI-powered books starring your family. 
            Every page is personalized with your photos and names.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href="#favorites"
              className="inline-block bg-[#6B8F5E] hover:bg-[#5A7F4D] text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('favorites')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Create Your Book ✨
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
