import Image from 'next/image'
import Link from 'next/link'

interface Press {
  id: string
  title: string
  thumbnail_url?: string | null
  published_date?: string | null
  summary?: string | null
  external_link?: string | null
}

interface PressListProps {
  items: Press[]
}

export default function PressList({ items }: PressListProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">언론 보도</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((item) => {
          const content = (
            <div className="bg-white rounded-card shadow-card overflow-hidden hover:shadow-lg transition-shadow">
              {item.thumbnail_url && (
                <div className="relative w-full h-40">
                  <Image
                    src={item.thumbnail_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                {item.published_date && (
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(item.published_date).toLocaleDateString('ko-KR')}
                  </p>
                )}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                {item.summary && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.summary}
                  </p>
                )}
              </div>
            </div>
          )

          if (item.external_link) {
            return (
              <Link
                key={item.id}
                href={item.external_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </Link>
            )
          }

          return <div key={item.id}>{content}</div>
        })}
      </div>
    </div>
  )
}
