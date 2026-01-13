'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { progressSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function createProgress(formData: FormData) {
  await requireAdmin()

  const data = {
    title: formData.get('title') as string,
    image_url: formData.get('image_url') as string | null,
    moq: formData.get('moq') as string | null,
    progress_percent: parseInt(formData.get('progress_percent') as string) || 0,
    stage: formData.get('stage') as '상담' | '샘플' | '발주' | '생산' | '배송',
    stage_date: formData.get('stage_date') as string | null,
  }

  const validated = progressSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('progress').insert(validated)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function updateProgress(id: string, formData: FormData) {
  await requireAdmin()

  const data = {
    title: formData.get('title') as string,
    image_url: formData.get('image_url') as string | null,
    moq: formData.get('moq') as string | null,
    progress_percent: parseInt(formData.get('progress_percent') as string) || 0,
    stage: formData.get('stage') as '상담' | '샘플' | '발주' | '생산' | '배송',
    stage_date: formData.get('stage_date') as string | null,
  }

  const validated = progressSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('progress')
    .update(validated)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function deleteProgress(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('progress').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/progress')
  revalidatePath('/')
}
