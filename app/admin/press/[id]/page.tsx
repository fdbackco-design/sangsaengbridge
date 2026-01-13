import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { notFound } from 'next/navigation'
import PressForm from './PressForm'

export default async function AdminPressEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServiceRoleClient()

  if (id === 'new') {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">새 언론보도</h1>
        <PressForm press={null} />
      </div>
    )
  }

  const { data: press } = await supabase
    .from('press')
    .select('*')
    .eq('id', id)
    .single()

  if (!press) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">언론보도 수정</h1>
      <PressForm press={press} />
    </div>
  )
}
