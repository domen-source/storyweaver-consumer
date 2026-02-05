'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="p-3">
      <Link href="/">
        <img 
          src="/uploads/photos/Logo1.png" 
          alt="Logo" 
          className="h-8 w-auto"
        />
      </Link>
    </header>
  )
}
