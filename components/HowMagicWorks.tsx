'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: 1,
    title: 'Upload Photos',
    description: 'Simply upload photos of your family members. Our AI will create illustrated versions of everyone.',
    gradient: 'from-[#E8EDDF] to-[#F0F4E8]',
    badgeColor: 'bg-[#6B8F5E]',
    placeholder: '[PLACEHOLDER - UPLOAD ICON (Cute illustration)]',
  },
  {
    number: 2,
    title: 'Choose Your Story',
    description: 'Pick from our collection of heartwarming stories, each designed to celebrate love, connection, and everyday moments between families.',
    gradient: 'from-[#DCE4D0] to-[#F0F4E8]',
    badgeColor: 'bg-[#6B8F5E]',
    placeholder: '[PLACEHOLDER - BOOK ICON (Cute illustration)]',
  },
  {
    number: 3,
    title: 'Enjoy Together',
    description: 'Receive your personalized book and create magical memories reading together with your loved ones.',
    gradient: 'from-[#E8EDDF] to-[#DCE4D0]',
    badgeColor: 'bg-[#6B8F5E]',
    placeholder: '[PLACEHOLDER - FAMILY ICON (Cute illustration)]',
  },
]

export default function HowMagicWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-4 text-gray-900">
          How Magic Works
        </h2>
        <p className="text-center text-gray-600 mb-16 text-lg">
          Create a personalized book in just a few simple steps
        </p>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div 
              key={step.number}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="relative mb-6 flex justify-center">
                <motion.div 
                  className={`w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-gray-400 text-xs text-center px-4">{step.placeholder}</span>
                </motion.div>
                <div className={`absolute -top-2 -right-2 ${step.badgeColor} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md`}>
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-display mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
