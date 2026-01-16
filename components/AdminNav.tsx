'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: '대시보드' },
  { href: '/admin/cases', label: '성공사례 관리' },
  { href: '/admin/banners', label: '배너 관리' },
  { href: '/admin/middle-banners', label: '중간 배너 관리' },
  { href: '/admin/progress', label: '진행상황 관리' },
  { href: '/admin/press', label: '언론보도 관리' },
  { href: '/admin/interviews', label: '인터뷰 관리' },
  { href: '/admin/about', label: '소개 편집' },
  { href: '/admin/guide', label: '이용안내 편집' },
  { href: '/admin/locations', label: '공장 위치 관리' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-button transition-colors ${
              isActive
                ? 'bg-burgundy-700 text-white'
                : 'text-gray-700 hover:bg-burgundy-700 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
