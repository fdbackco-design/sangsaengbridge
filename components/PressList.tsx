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

  const firstItem = items[0]
  const remainingItems = items.slice(1)

  const renderPressItem = (item: Press, isLarge = false) => {
    const content = (
      <div className={`bg-white rounded-card shadow-card overflow-hidden hover:shadow-lg transition-shadow ${isLarge ? 'md:max-w-2xl md:mx-auto' : ''}`}>
        {item.thumbnail_url && (
          <div className={`relative w-full ${isLarge ? 'h-40 md:h-80' : 'h-40'}`}>
            <Image
              src={item.thumbnail_url}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className={`${isLarge ? 'p-4 md:p-8' : 'p-4'}`}>
          {item.published_date && (
            <p className={`${isLarge ? 'text-xs md:text-base' : 'text-xs'} text-gray-500 mb-2`}>
              {new Date(item.published_date).toLocaleDateString('ko-KR')}
            </p>
          )}
          <h3 className={`${isLarge ? 'font-semibold md:text-xl' : 'font-semibold'} text-gray-900 mb-2 ${isLarge ? 'line-clamp-2 md:line-clamp-none' : 'line-clamp-2'}`}>
            {item.title}
          </h3>
          {item.summary && (
            <p className={`${isLarge ? 'text-sm md:text-lg' : 'text-sm'} text-gray-600 ${isLarge ? 'line-clamp-2 md:line-clamp-none' : 'line-clamp-2'}`}>
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
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">언론 보도</h2>
      
      {/* 모바일: 모든 항목을 그리드로 표시 */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {items.map((item) => renderPressItem(item, false))}
      </div>

      {/* 웹: 첫 번째 항목만 크게 가운데 정렬 */}
      {firstItem && (
        <div className="hidden md:block">
          {renderPressItem(firstItem, true)}
        </div>
      )}
    </div>
  )
}
