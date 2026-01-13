import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import AboutForm from './AboutForm'

export default async function AdminAboutPage() {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { data: about } = await supabase
    .from('about')
    .select('*')
    .single()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">소개 편집</h1>
      <AboutForm about={about} />
    </div>
  )
}
