import Link from 'next/link'

export default function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-dark-blue hover:text-blue-600 transition-colors mb-6"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span className="font-medium">Back</span>
    </Link>
  )
}

