'use client'

export default function FloatingCall() {
  return (
    <a
      href="tel:1688-1234"
      className="fixed bottom-24 right-4 z-40 bg-white rounded-button shadow-soft flex items-center gap-2 px-3 py-2 hover:shadow-card transition-all"
      aria-label="전화하기"
    >
      <div className="w-8 h-8 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </div>
      <span className="text-gray-900 font-medium text-sm whitespace-nowrap">1688-1234</span>
    </a>
  )
}
