'use client'

import { motion } from 'framer-motion'

const communityPhotos = [
  { id: 1, placeholder: '[PLACEHOLDER - COMMUNITY PHOTO 1]' },
  { id: 2, placeholder: '[PLACEHOLDER - COMMUNITY PHOTO 2]' },
  { id: 3, placeholder: '[PLACEHOLDER - COMMUNITY PHOTO 3]' },
  { id: 4, placeholder: '[PLACEHOLDER - COMMUNITY PHOTO 4]' },
  { id: 5, placeholder: '[PLACEHOLDER - COMMUNITY PHOTO 5]' },
  { id: 6, placeholder: '[PLACEHOLDER - COMMUNITY PHOTO 6]' },
]

export default function CommunityPhotosSection() {
  return (
    <section className="pt-10 pb-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-4 text-gray-900">
          Photos from Our Community
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Join thousands of families creating magical memories
        </p>

        {/* Photo Grid - Masonry style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {communityPhotos.map((photo, index) => (
            <motion.div 
              key={photo.id} 
              className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-full h-full flex items-center justify-center p-4">
                <span className="text-gray-500 text-xs text-center">{photo.placeholder}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


