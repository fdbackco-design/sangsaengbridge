'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { factoryLocationSchema } from '@/lib/validators'
import { useRouter } from 'next/navigation'
import { createLocation, updateLocation } from './actions'

interface Location {
  id: string
  title: string
  latitude: number
  longitude: number
  address?: string | null
}

interface LocationFormProps {
  location?: Location
}

type FormData = {
  title: string
  latitude: number
  longitude: number
  address?: string
}

export default function LocationForm({ location }: LocationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(factoryLocationSchema),
    defaultValues: location
      ? {
          title: location.title,
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address || '',
        }
      : undefined,
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('latitude', data.latitude.toString())
      formData.append('longitude', data.longitude.toString())
      if (data.address) formData.append('address', data.address)

      const result = location
        ? await updateLocation(location.id, formData)
        : await createLocation(formData)

      if (result.success) {
        router.push('/admin/locations')
        router.refresh()
      } else {
        setError(result.error || '저장에 실패했습니다.')
      }
    } catch (err) {
      setError('저장 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-card shadow-soft p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-button text-red-800 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            주소
          </label>
          <input
            type="text"
            id="address"
            {...register('address')}
            className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
              위도 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="latitude"
              step="any"
              {...register('latitude', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
            />
            {errors.latitude && (
              <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
              경도 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="longitude"
              step="any"
              {...register('longitude', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
            />
            {errors.longitude && (
              <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-burgundy-700 text-white font-semibold rounded-button hover:bg-burgundy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-button hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
