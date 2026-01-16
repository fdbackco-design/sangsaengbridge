import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { notFound } from 'next/navigation'
import InterviewForm from './InterviewForm'

export default async function AdminInterviewEditPage({
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">새 인터뷰</h1>
        <InterviewForm interview={null} />
      </div>
    )
  }

  const { data: interview } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', id)
    .single()

  if (!interview) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">인터뷰 수정</h1>
      <InterviewForm interview={interview} />
    </div>
  )
}
