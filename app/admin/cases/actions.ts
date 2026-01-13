'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { caseSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function createCase(formData: FormData) {
  await requireAdmin()

  const data = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    summary: formData.get('summary') as string | null,
    content_markdown: formData.get('content_markdown') as string | null,
    category_id: formData.get('category_id') as string | null,
    thumbnail_image_1: formData.get('thumbnail_image_1') as string,
    thumbnail_image_2: formData.get('thumbnail_image_2') as string | null,
    detail_image: formData.get('detail_image') as string | null,
    hashtags: formData.get('hashtags') ? (formData.get('hashtags') as string).split(',').map(t => t.trim()).filter(Boolean) : [],
    is_featured: formData.get('is_featured') === 'true',
  }

  const validated = caseSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('cases').insert(validated)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/cases')
  revalidatePath('/')
  return { success: true }
}

export async function updateCase(id: string, formData: FormData) {
  await requireAdmin()

  const data = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    summary: formData.get('summary') as string | null,
    content_markdown: formData.get('content_markdown') as string | null,
    category_id: formData.get('category_id') as string | null,
    thumbnail_image_1: formData.get('thumbnail_image_1') as string,
    thumbnail_image_2: formData.get('thumbnail_image_2') as string | null,
    detail_image: formData.get('detail_image') as string | null,
    hashtags: formData.get('hashtags') ? (formData.get('hashtags') as string).split(',').map(t => t.trim()).filter(Boolean) : [],
    is_featured: formData.get('is_featured') === 'true',
  }

  const validated = caseSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('cases')
    .update(validated)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/cases')
  revalidatePath(`/cases/${validated.slug}`)
  revalidatePath('/')
  return { success: true }
}

export async function deleteCase(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('cases').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/cases')
  revalidatePath('/cases')
  revalidatePath('/')
}
