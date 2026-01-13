import { requireAdmin } from '@/lib/auth/guard'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import LocationForm from '../LocationForm'

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const supabase = createClient()

  const { data: location } = await supabase
    .from('factory_locations')
    .select('*')
    .eq('id', id)
    .single()

  if (!location) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">공장 위치 수정</h1>
      <LocationForm location={location} />
    </div>
  )
}
