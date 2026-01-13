import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import CaseForm from '../[id]/CaseForm'

export default async function AdminCaseNewPage() {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { data: categories } = await supabase
    .from('case_categories')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">새 성공사례</h1>
      <CaseForm caseItem={null} categories={categories || []} />
    </div>
  )
}
