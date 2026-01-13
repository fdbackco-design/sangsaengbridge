'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { middleBannerSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function createMiddleBanner(formData: FormData) {
  await requireAdmin()

  const data = {
    image_url: formData.get('image_url') as string,
    link_url: (formData.get('link_url') as string) || undefined,
    is_active: formData.get('is_active') === 'true',
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }
  
  if (data.link_url === '') data.link_url = undefined

  const validated = middleBannerSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('middle_banners').insert(validated)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function updateMiddleBanner(id: string, formData: FormData) {
  await requireAdmin()

  const data = {
    image_url: formData.get('image_url') as string,
    link_url: (formData.get('link_url') as string) || undefined,
    is_active: formData.get('is_active') === 'true',
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }
  
  if (data.link_url === '') data.link_url = undefined

  const validated = middleBannerSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('middle_banners')
    .update(validated)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function deleteMiddleBanner(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('middle_banners').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/middle-banners')
  revalidatePath('/')
}
