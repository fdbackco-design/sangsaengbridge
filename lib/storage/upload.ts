import { createServiceRoleClient } from '@/lib/supabase/server'

export async function uploadFile(
  bucket: string,
  file: File,
  path: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  try {
    const supabase = createServiceRoleClient()
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return { url: null, error: error.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    return { url: null, error: '파일 업로드 중 오류가 발생했습니다.' }
  }
}

export async function deleteFile(bucket: string, path: string): Promise<{ error: string | null }> {
  try {
    const supabase = createServiceRoleClient()
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    return { error: '파일 삭제 중 오류가 발생했습니다.' }
  }
}

export async function getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createServiceRoleClient()
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      return { url: null, error: error.message }
    }

    return { url: data.signedUrl, error: null }
  } catch (error) {
    return { url: null, error: '서명된 URL 생성 중 오류가 발생했습니다.' }
  }
}
