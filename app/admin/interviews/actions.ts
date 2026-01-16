'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { interviewSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function createInterview(formData: FormData) {
  await requireAdmin()

  const closingTextValue = formData.get('closing_text') as string | null

  const data = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    image_url: (formData.get('image_url') as string) || undefined,
    summary: (formData.get('summary') as string) || undefined,
    content_markdown: (formData.get('content_markdown') as string) || undefined,
    closing_text: closingTextValue === null || closingTextValue === '' ? null : closingTextValue,
    sort_order: formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0,
    is_active: formData.get('is_active') === 'true',
  }
  
  // 빈 문자열을 undefined로 변환 (closing_text 제외 - null로 처리)
  if (data.image_url === '') data.image_url = undefined
  if (data.summary === '') data.summary = undefined
  if (data.content_markdown === '') data.content_markdown = undefined

  const validated = interviewSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('interviews').insert(validated)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/interviews')
  return { success: true }
}

export async function updateInterview(id: string, formData: FormData) {
  await requireAdmin()

  const closingTextValue = formData.get('closing_text') as string | null

  const data = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    image_url: (formData.get('image_url') as string) || undefined,
    summary: (formData.get('summary') as string) || undefined,
    content_markdown: (formData.get('content_markdown') as string) || undefined,
    closing_text: closingTextValue === null || closingTextValue === '' ? null : closingTextValue,
    sort_order: formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0,
    is_active: formData.get('is_active') === 'true',
  }
  
  // 빈 문자열을 undefined로 변환 (closing_text 제외 - null로 처리)
  if (data.image_url === '') data.image_url = undefined
  if (data.summary === '') data.summary = undefined
  if (data.content_markdown === '') data.content_markdown = undefined

  const validated = interviewSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('interviews')
    .update(validated)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/interviews')
  return { success: true }
}

export async function deleteInterview(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('interviews').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/interviews')
  revalidatePath('/')
}
