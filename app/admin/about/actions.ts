'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { aboutSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function updateAbout(id: string, formData: FormData) {
  await requireAdmin()

  const data = {
    section_title: formData.get('section_title') as string,
    section_description: formData.get('section_description') as string | null,
    strength_1_title: formData.get('strength_1_title') as string | null,
    strength_1_description: formData.get('strength_1_description') as string | null,
    strength_2_title: formData.get('strength_2_title') as string | null,
    strength_2_description: formData.get('strength_2_description') as string | null,
    strength_3_title: formData.get('strength_3_title') as string | null,
    strength_3_description: formData.get('strength_3_description') as string | null,
    strength_4_title: formData.get('strength_4_title') as string | null,
    strength_4_description: formData.get('strength_4_description') as string | null,
  }

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
