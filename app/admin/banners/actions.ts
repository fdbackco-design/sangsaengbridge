'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { bannerSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function createBanner(formData: FormData) {
  await requireAdmin()

  const data = {
    image_url: formData.get('image_url') as string,
    link_url: formData.get('link_url') as string | null,
    is_active: formData.get('is_active') === 'true',
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }

  const validated = bannerSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('banners').insert(validated)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function updateBanner(id: string, formData: FormData) {
  await requireAdmin()

  const data = {
    image_url: formData.get('image_url') as string,
    link_url: formData.get('link_url') as string | null,
    is_active: formData.get('is_active') === 'true',
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }

  const validated = bannerSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('banners')
    .update(validated)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function deleteBanner(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('banners').delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}
