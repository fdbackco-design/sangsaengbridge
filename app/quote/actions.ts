'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/storage/upload'
import { sendQuoteEmail } from '@/lib/email'
import { checkRateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

export async function submitQuote(formData: FormData) {
  try {
    // Rate limit 체크
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const rateLimit = checkRateLimit(ip)

    if (!rateLimit.allowed) {
      return {
        success: false,
        error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
      }
    }

    // Honeypot 체크
    const honeypot = formData.get('honeypot') as string
    if (honeypot && honeypot.length > 0) {
      return {
        success: false,
        error: '스팸으로 감지되었습니다.',
      }
    }

    const name = formData.get('name') as string
    const contact = formData.get('contact') as string
    const category = formData.get('category') as string | null
    const example_product_link = formData.get('example_product_link') as string | null
    const requirements = formData.get('requirements') as string | null
    const file = formData.get('file') as File | null

    // 파일 업로드 처리
    let fileUrl: string | null = null
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `quotes/${fileName}`

      const uploadResult = await uploadFile('uploads', file, filePath)
      if (uploadResult.error) {
        return {
          success: false,
          error: '파일 업로드에 실패했습니다.',
        }
      }
      fileUrl = uploadResult.url
    }

    // DB에 저장
    const supabase = createServiceRoleClient()
    const { error: dbError } = await supabase.from('quotes').insert({
      name,
      contact,
      category: category || null,
      example_product_link: example_product_link || null,
      requirements: requirements || null,
      file_url: fileUrl,
      ip_address: ip,
    })

    if (dbError) {
      return {
        success: false,
        error: '견적 신청 저장에 실패했습니다.',
      }
    }

    // 이메일 발송
    const emailResult = await sendQuoteEmail({
      name,
      contact,
      category: category || undefined,
      example_product_link: example_product_link || undefined,
      requirements: requirements || undefined,
      file_url: fileUrl || undefined,
    })

    if (!emailResult.success) {
      // 이메일 발송 실패해도 DB에는 저장되었으므로 성공으로 처리
      console.error('이메일 발송 실패:', emailResult.error)
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('견적 신청 오류:', error)
    return {
      success: false,
      error: '견적 신청 중 오류가 발생했습니다.',
    }
  }
}
