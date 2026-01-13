'use server'

import { uploadFile } from '@/lib/storage/upload'
import { requireAdmin } from '@/lib/auth/guard'

export async function uploadImage(formData: FormData) {
  await requireAdmin()

  const file = formData.get('file') as File
  const bucket = formData.get('bucket') as string || 'cases'

  if (!file) {
    return { success: false, error: '파일이 없습니다.' }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${bucket}/${fileName}`

  const result = await uploadFile(bucket, file, filePath)

  if (result.error) {
    return { success: false, error: result.error, url: null }
  }

  return { success: true, error: null, url: result.url }
}
