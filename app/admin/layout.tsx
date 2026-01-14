import { getCurrentUser } from '@/lib/auth/guard'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 로그인 페이지는 이 layout을 사용하지 않으므로
  // requireAdmin 대신 getCurrentUser를 사용하여 조건부 렌더링
  const user = await getCurrentUser()
  const supabase = createClient()
  
  // user가 없거나 admin이 아니면 children만 렌더링 (로그인 페이지일 수 있음)
  if (!user) {
    return <>{children}</>
  }
  
  // admin role 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return <>{children}</>
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <nav className="bg-white shadow-soft border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="text-base sm:text-xl font-bold text-burgundy-700">
              관리자 대시보드
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-xs sm:text-sm text-gray-600">{user?.email}</span>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-700 hover:text-burgundy-700"
                >
                  로그아웃
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 bg-white rounded-card shadow-soft p-4 h-fit">
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="block px-4 py-2 text-gray-700 hover:bg-cream-50 rounded-button transition-colors"
              >
                대시보드
              </Link>
              <Link
                href="/admin/cases"
                className="block px-4 py-2 text-gray-700 hover:bg-cream-50 rounded-button transition-colors"
              >
                성공사례 관리
              </Link>
              <Link
                href="/admin/banners"
                className="block px-4 py-2 text-gray-700 hover:bg-cream-50 rounded-button transition-colors"
              >
                배너 관리
              </Link>
              <Link
                href="/admin/middle-banners"
                className="block px-4 py-2 text-gray-700 hover:bg-cream-50 rounded-button transition-colors"
              >
                중간 배너 관리
              </Link>
              <Link
                href="/admin/progress"
                className="block px-4 py-2 text-gray-700 hover:bg-cream-50 rounded-button transition-colors"
              >
                진행상황 관리
              </Link>
              <Link
                href="/admin/press"
                className="block px-4 py-2 text-gray-700 hover:bg-cream-50 rounded-button transition-colors"
              >
                언론보도 관리
              </Link>
              <Link
                href="/admin/about"
                className="block px-4 py-2 text-gray-700 hover:bg-cream-50 rounded-button transition-colors"
              >
                소개 편집
              </Link>
              <Link
                href="/admin/guide"
                className="block px-4 py-2 text-gray-700 hover:bg-cream-50 rounded-button transition-colors"
              >
                이용안내 편집
              </Link>
              <Link
                href="/admin/locations"
                className="block px-4 py-2 text-gray-700 hover:bg-cream-50 rounded-button transition-colors"
              >
                공장 위치 관리
              </Link>
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
