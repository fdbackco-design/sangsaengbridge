'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { guideStepSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function updateGuideStep(id: string, formData: FormData) {
  await requireAdmin()

  const data = {
    step_number: parseInt(formData.get('step_number') as string) || 1,
    title: formData.get('title') as string,
    description: formData.get('description') as string | null,
  }

  const validated = guideStepSchema.parse(data)

  const supabase = createServiceRoleClient()
  const { error } = await supabase
    .from('guide_steps')
    .update({
      title: validated.title,
      description: validated.description || null,
    })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/guide')
  revalidatePath('/')
  return { success: true }
}
