import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { notFound } from 'next/navigation'
import ProgressForm from './ProgressForm'

export default async function AdminProgressEditPage({
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">새 진행상황</h1>
        <ProgressForm progress={null} />
      </div>
    )
  }

  const { data: progress } = await supabase
    .from('progress')
    .select('*')
    .eq('id', id)
    .single()

  if (!progress) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">진행상황 수정</h1>
      <ProgressForm progress={progress} />
    </div>
  )
}
