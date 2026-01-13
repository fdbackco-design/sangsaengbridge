import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import GuideForm from './GuideForm'

export default async function AdminGuidePage() {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { data: steps } = await supabase
    .from('guide_steps')
    .select('*')
    .order('step_number', { ascending: true })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">이용안내 편집</h1>
      <GuideForm steps={steps || []} />
    </div>
  )
}
