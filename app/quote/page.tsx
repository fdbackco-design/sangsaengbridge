'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { quoteSchema } from '@/lib/validators'
import { submitQuote } from './actions'

type QuoteFormData = {
  name: string
  contact: string
  category?: string
  example_product_link?: string
  requirements?: string
  privacy_agreed: boolean
  honeypot?: string
}

export default function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      privacy_agreed: false,
    },
  })

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('contact', data.contact)
      if (data.category) formData.append('category', data.category)
      if (data.example_product_link) formData.append('example_product_link', data.example_product_link)
      if (data.requirements) formData.append('requirements', data.requirements)
      formData.append('privacy_agreed', 'true')
      
      // 파일 업로드
      const fileInput = document.getElementById('file') as HTMLInputElement
      if (fileInput?.files?.[0]) {
        formData.append('file', fileInput.files[0])
      }

      const result = await submitQuote(formData)

      if (result.success) {
        setSubmitStatus('success')
        reset()
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || '견적 신청에 실패했습니다.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('견적 신청 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">무료 견적 신청</h1>

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-card text-red-800">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Honeypot 필드 (스팸 방지) */}
        <input
          type="text"
          {...register('honeypot')}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* 이름 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* 연락처 */}
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
            연락처 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="contact"
            {...register('contact')}
            className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
            placeholder="010-1234-5678"
          />
          {errors.contact && (
            <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>
          )}
        </div>

        {/* 카테고리 */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <select
            id="category"
            {...register('category')}
            className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          >
            <option value="">선택해주세요</option>
            <option value="living">생활용품</option>
            <option value="kitchen">주방용품</option>
            <option value="cosmetic">화장품용기</option>
            <option value="other">기타</option>
          </select>
        </div>

        {/* 예시 제품 링크 */}
        <div>
          <label htmlFor="example_product_link" className="block text-sm font-medium text-gray-700 mb-2">
            예시 제품 링크
          </label>
          <input
            type="url"
            id="example_product_link"
            {...register('example_product_link')}
            className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
            placeholder="https://example.com/product"
          />
          {errors.example_product_link && (
            <p className="mt-1 text-sm text-red-600">{errors.example_product_link.message}</p>
          )}
        </div>

        {/* 요청사항 */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
            요청사항
          </label>
          <textarea
            id="requirements"
            {...register('requirements')}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
            placeholder="제품에 대한 요청사항을 자세히 적어주세요."
          />
        </div>

        {/* 파일 첨부 */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            참고 파일 (선택)
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            PDF, Word, 이미지 파일만 업로드 가능합니다. (최대 10MB)
          </p>
        </div>

        {/* 개인정보처리방침 동의 */}
        <div>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register('privacy_agreed')}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              개인정보처리방침에 동의합니다. <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.privacy_agreed && (
            <p className="mt-1 text-sm text-red-600">{errors.privacy_agreed.message}</p>
          )}
        </div>

        {/* 성공 메시지 */}
        {submitStatus === 'success' && (
          <div className="p-6 md:p-4 bg-green-100 md:bg-green-50 border-2 md:border border-green-500 md:border-green-200 rounded-card text-green-900 md:text-green-800 text-center text-lg md:text-base font-semibold md:font-normal">
            견적 신청이 완료되었습니다.<br />
            빠른 시일 내에 연락드리겠습니다.
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 bg-burgundy-700 text-white font-semibold rounded-button hover:bg-burgundy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? '제출 중...' : '견적 신청하기'}
        </button>
      </form>
    </div>
  )
}
