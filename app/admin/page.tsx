import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import Link from 'next/link'

export default async function AdminDashboard() {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const [cases, banners, progress, press, quotes] = await Promise.all([
    supabase.from('cases').select('id', { count: 'exact', head: true }),
    supabase.from('banners').select('id', { count: 'exact', head: true }),
    supabase.from('progress').select('id', { count: 'exact', head: true }),
    supabase.from('press').select('id', { count: 'exact', head: true }),
    supabase.from('quotes').select('id', { count: 'exact', head: true }).order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">대시보드</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-card shadow-soft p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">성공사례</h3>
          <p className="text-3xl font-bold text-burgundy-700">{cases.count || 0}</p>
        </div>
        <div className="bg-white rounded-card shadow-soft p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">배너</h3>
          <p className="text-3xl font-bold text-burgundy-700">{banners.count || 0}</p>
        </div>
        <div className="bg-white rounded-card shadow-soft p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">진행상황</h3>
          <p className="text-3xl font-bold text-burgundy-700">{progress.count || 0}</p>
        </div>
        <div className="bg-white rounded-card shadow-soft p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">언론보도</h3>
          <p className="text-3xl font-bold text-burgundy-700">{press.count || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-card shadow-soft p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">최근 견적 신청</h2>
        <p className="text-gray-600">총 {quotes.count || 0}건</p>
      </div>
    </div>
  )
}
