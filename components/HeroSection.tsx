'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

// Floating decorative elements
const FloatingHeart = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute text-pink-200 ${className}`}
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
    className={`absolute text-blue-100 ${className}`}
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
    className={`absolute text-purple-200 ${className}`}
    animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay }}
  >
    ✨
  </motion.div>
)

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-pink-50 to-white pt-4 pb-4 md:pt-12 md:pb-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingHeart className="top-20 left-[5%] md:left-[10%]" delay={0} />
        <FloatingHeart className="top-40 left-[75%] md:right-[15%]" delay={1.5} />
        <FloatingHeart className="bottom-40 left-[10%] md:left-[20%]" delay={0.8} />
        <FloatingStar className="top-32 left-[15%] md:left-[25%]" delay={0.5} />
        <FloatingStar className="top-24 left-[70%] md:right-[25%]" delay={2} />
        <FloatingStar className="bottom-32 left-[80%] md:right-[10%]" delay={1} />
        <FloatingCloud className="top-16 left-[2%] md:left-[5%] opacity-60" delay={0} />
        <FloatingCloud className="top-28 left-[85%] md:right-[8%] opacity-40" delay={2} />
        <FloatingSparkle className="top-48 left-[20%] md:left-[30%]" delay={0.3} />
        <FloatingSparkle className="top-36 left-[65%] md:right-[30%]" delay={1.2} />
        <FloatingSparkle className="bottom-48 left-[8%] md:left-[15%]" delay={0.7} />
        <FloatingSparkle className="bottom-36 left-[72%] md:right-[20%]" delay={1.8} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Book covers - 3 books floating/tilted */}
        <div className="flex justify-center items-center mb-3 md:mb-6 relative h-96 md:h-[500px]">
          {/* Floating Image - Right behind center book */}
          <motion.div 
            className="absolute left-1/2 z-15"
            style={{ transform: 'translateX(100px) scale(0.85)' }}
            animate={{ y: [0, -18, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            <div className="w-48 md:w-56 h-64 md:h-72 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg shadow-xl flex items-center justify-center border-4 border-white opacity-80">
              <span className="text-teal-400 text-xs text-center px-3">[PLACEHOLDER - Right floating image]</span>
            </div>
          </motion.div>

          {/* Book 1 - Left - tilted -8deg, slightly back */}
          <motion.div 
            className="absolute left-1/2 z-30 hidden md:block"
            style={{ transform: 'translateX(-420px) rotate(-8deg) scale(0.9)' }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-56 md:w-64 h-72 md:h-80 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg shadow-2xl flex items-center justify-center border-4 border-white">
              <span className="text-pink-400 text-sm text-center px-4">[PLACEHOLDER - HERO BOOK 1 (Left tilted book)]</span>
            </div>
          </motion.div>

          {/* Book 2 - Center - Main focus, no tilt */}
          <motion.div 
            className="relative z-20"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="w-64 md:w-80 h-80 md:h-[440px] bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg shadow-2xl flex items-center justify-center border-4 border-white">
              <span className="text-purple-400 text-sm text-center px-4">[PLACEHOLDER - HERO BOOK 2 (Center main book)]</span>
            </div>
          </motion.div>

          {/* Book 3 - Right - tilted 8deg, slightly back */}
          <motion.div 
            className="absolute left-1/2 z-10 hidden md:block"
            style={{ transform: 'translateX(280px) rotate(8deg) scale(0.85)' }}
            animate={{ y: [0, -25, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="w-56 md:w-64 h-72 md:h-80 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg shadow-2xl flex items-center justify-center border-4 border-white">
              <span className="text-blue-400 text-sm text-center px-4">[PLACEHOLDER - HERO BOOK 3 (Right tilted book)]</span>
            </div>
          </motion.div>
        </div>

        {/* Headline */}
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600">Personalized</span> Storybooks That
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
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
            <Link
              href="/create"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
            >
              Create Your Book ✨
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
