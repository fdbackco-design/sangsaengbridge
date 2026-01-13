'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { pressSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function createPress(formData: FormData) {
  await requireAdmin()

  const data = {
    title: formData.get('title') as string,
    thumbnail_url: formData.get('thumbnail_url') as string | null,
    published_date: formData.get('published_date') as string | null,
    summary: formData.get('summary') as string | null,
    external_link: formData.get('external_link') as string | null,
  }

  const validated = pressSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('press').insert(validated)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function updatePress(id: string, formData: FormData) {
  await requireAdmin()

  const data = {
    title: formData.get('title') as string,
    thumbnail_url: formData.get('thumbnail_url') as string | null,
    published_date: formData.get('published_date') as string | null,
    summary: formData.get('summary') as string | null,
    external_link: formData.get('external_link') as string | null,
  }

  const validated = pressSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('press')
    .update(validated)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function deletePress(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('press').delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}
