'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { factoryLocationSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function createLocation(formData: FormData) {
  await requireAdmin()

  const data = {
    title: formData.get('title') as string,
    latitude: parseFloat(formData.get('latitude') as string),
    longitude: parseFloat(formData.get('longitude') as string),
    address: formData.get('address') as string | null,
  }

  const validated = factoryLocationSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('factory_locations').insert(validated)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/locations')
  revalidatePath('/')
  return { success: true }
}

export async function updateLocation(id: string, formData: FormData) {
  await requireAdmin()

  const data = {
    title: formData.get('title') as string,
    latitude: parseFloat(formData.get('latitude') as string),
    longitude: parseFloat(formData.get('longitude') as string),
    address: formData.get('address') as string | null,
  }

  const validated = factoryLocationSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('factory_locations')
    .update(validated)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/locations')
  revalidatePath('/')
  return { success: true }
}

export async function deleteLocation(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('factory_locations').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/locations')
  revalidatePath('/')
}
