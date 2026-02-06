'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const AccordionItem = ({ title, sectionKey }: { title: string, sectionKey: string }) => (
    <div className="border-b border-[#5A7F4D]">
      <button 
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex justify-between items-center py-4 px-6 text-left font-bold text-lg"
      >
        {title}
        <span className={`transform transition-transform duration-300 ${openSection === sectionKey ? 'rotate-180' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {openSection === sectionKey && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#5A7F4D]"
          >
            <div className="px-6 py-4 space-y-2">
              <p className="text-sm opacity-80">[Links coming soon]</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <footer className="w-full">
      {/* Main Green Section */}
      <div className="bg-[#6B8F5E] text-white pb-8">
        {/* Accordions */}
        <div>
          <AccordionItem title="Support" sectionKey="support" />
          <AccordionItem title="Legal" sectionKey="legal" />
          <AccordionItem title="Our Story" sectionKey="story" />
        </div>

        <div className="px-6 mt-8">
          {/* Payment Options */}
          <div className="mb-8">
            <h3 className="font-bold text-xl mb-4">Payment Options</h3>
            <div className="flex flex-wrap gap-3">
              {/* Using placeholders/text for now as SVG assets would be large inline */}
              <div className="bg-white text-blue-900 p-1 rounded w-10 h-6 flex items-center justify-center text-[8px] font-bold">VISA</div>
              <div className="bg-white text-orange-600 p-1 rounded w-10 h-6 flex items-center justify-center text-[8px] font-bold">MC</div>
              <div className="bg-white text-blue-500 p-1 rounded w-10 h-6 flex items-center justify-center text-[8px] font-bold">AMEX</div>
              <div className="bg-white text-orange-500 p-1 rounded w-10 h-6 flex items-center justify-center text-[8px] font-bold">DISC</div>
              <div className="bg-white text-blue-700 p-1 rounded w-10 h-6 flex items-center justify-center text-[8px] font-bold">PAY</div>
              <div className="bg-pink-300 text-black p-1 rounded w-12 h-6 flex items-center justify-center text-[8px] font-bold">Klarna</div>
            </div>
          </div>

          {/* Our Stores Worldwide */}
          <div>
            <h3 className="font-bold text-xl mb-4">Our Stores Worldwide</h3>
            <div className="grid grid-cols-6 gap-y-4 gap-x-2 text-2xl">
              <span>🇺🇸</span>
              <span>🇨🇦</span>
              <span>🇦🇺</span>
              <span>🇬🇧</span>
              <span>🇲🇽</span>
              <span>🇩🇪</span>
              <span>🇫🇷</span>
              <span>🇮🇹</span>
              <span>🇦🇹</span>
              <span>🇪🇸</span>
              <span>🇧🇪</span>
              <span>🇸🇮</span>
              <span>🇵🇱</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom White Bar */}
      <div className="bg-white py-6 border-t border-gray-100">
        <div className="flex justify-center gap-8 text-gray-400">
          {/* Facebook */}
          <a href="#" className="hover:text-[#6B8F5E] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
          </a>
          {/* Instagram */}
          <a href="#" className="hover:text-[#6B8F5E] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          {/* TikTok */}
          <a href="#" className="hover:text-[#6B8F5E] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-2.89 6.24-1.77 1.4-4.11 1.94-6.32 1.46-2.52-.52-4.64-2.28-5.69-4.66C.7 14.88 1.39 12 3.32 9.97c1.55-1.63 3.9-2.31 6.13-1.78v4.2c-.88-.47-1.99-.44-2.86.07-.87.52-1.39 1.48-1.35 2.49.04 1.25.99 2.33 2.22 2.52 1.23.19 2.48-.48 3-1.61.27-.6.41-1.26.41-1.93V.02z"></path></svg>
          </a>
          {/* Pinterest */}
          <a href="#" className="hover:text-[#6B8F5E] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"></path></svg>
          </a>
          {/* YouTube */}
          <a href="#" className="hover:text-[#6B8F5E] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
          </a>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-100 py-8 text-center text-gray-600 text-sm">
        <p className="mb-4">© 2026 Little Booky. All rights reserved.</p>
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:underline">Do Not Sell My Personal Information</a>
          <a href="#" className="hover:underline">Terms and conditions</a>
        </div>
      </div>
    </footer>
  )
}