import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { notFound } from 'next/navigation'
import CaseForm from './CaseForm'

export default async function AdminCaseEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServiceRoleClient()

  const { data: caseItem } = await supabase
    .from('cases')
    .select('*')
    .eq('id', id)
    .single()

  if (!caseItem) {
    notFound()
  }

  const { data: categories } = await supabase
    .from('case_categories')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {id === 'new' ? '새 성공사례' : '성공사례 수정'}
      </h1>
      <CaseForm caseItem={id === 'new' ? null : caseItem} categories={categories || []} />
    </div>
  )
}
