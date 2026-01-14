import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import Link from 'next/link'
import CasesTable from './CasesTable'

export default async function AdminCasesPage() {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { data: cases } = await supabase
    .from('cases')
    .select(`
      *,
      category:case_categories(*)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">성공사례 관리</h1>
        <Link
          href="/admin/cases/new"
          className="px-4 py-2 bg-burgundy-700 text-white rounded-button hover:bg-burgundy-800 transition-colors"
        >
          새로 만들기
        </Link>
      </div>

      <CasesTable cases={cases || []} />
    </div>
  )
}
