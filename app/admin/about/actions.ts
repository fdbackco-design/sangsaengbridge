'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { aboutSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function updateAbout(id: string, formData: FormData) {
  await requireAdmin()

  const data = {
    section_title: formData.get('section_title') as string,
    section_description: (formData.get('section_description') as string) || undefined,
    strength_1_title: (formData.get('strength_1_title') as string) || undefined,
    strength_1_description: (formData.get('strength_1_description') as string) || undefined,
    strength_1_image_url: (formData.get('strength_1_image_url') as string) || undefined,
    strength_2_title: (formData.get('strength_2_title') as string) || undefined,
    strength_2_description: (formData.get('strength_2_description') as string) || undefined,
    strength_2_image_url: (formData.get('strength_2_image_url') as string) || undefined,
    strength_3_title: (formData.get('strength_3_title') as string) || undefined,
    strength_3_description: (formData.get('strength_3_description') as string) || undefined,
    strength_3_image_url: (formData.get('strength_3_image_url') as string) || undefined,
    strength_4_title: (formData.get('strength_4_title') as string) || undefined,
    strength_4_description: (formData.get('strength_4_description') as string) || undefined,
    strength_4_image_url: (formData.get('strength_4_image_url') as string) || undefined,
  }
  
  // 빈 문자열을 undefined로 변환
  if (data.section_description === '') data.section_description = undefined
  if (data.strength_1_title === '') data.strength_1_title = undefined
  if (data.strength_1_description === '') data.strength_1_description = undefined
  if (data.strength_1_image_url === '') data.strength_1_image_url = undefined
  if (data.strength_2_title === '') data.strength_2_title = undefined
  if (data.strength_2_description === '') data.strength_2_description = undefined
  if (data.strength_2_image_url === '') data.strength_2_image_url = undefined
  if (data.strength_3_title === '') data.strength_3_title = undefined
  if (data.strength_3_description === '') data.strength_3_description = undefined
  if (data.strength_3_image_url === '') data.strength_3_image_url = undefined
  if (data.strength_4_title === '') data.strength_4_title = undefined
  if (data.strength_4_description === '') data.strength_4_description = undefined
  if (data.strength_4_image_url === '') data.strength_4_image_url = undefined

  const validated = aboutSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('about')
    .update(validated)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}
