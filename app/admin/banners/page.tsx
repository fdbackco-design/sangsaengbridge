import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import Link from 'next/link'
import Image from 'next/image'
import { deleteBanner } from './actions'

export default async function AdminBannersPage() {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">배너 관리</h1>
        <Link
          href="/admin/banners/new"
          className="px-4 py-2 bg-burgundy-700 text-white rounded-button hover:bg-burgundy-800 transition-colors"
        >
          새로 만들기
        </Link>
      </div>

      <div className="bg-white rounded-card shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">이미지</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">링크</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">상태</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">순서</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {banners && banners.length > 0 ? (
              banners.map((banner) => (
                <tr key={banner.id}>
                  <td className="px-4 py-3">
                    <div className="relative w-24 h-16">
                      <Image
                        src={banner.image_url}
                        alt="배너"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {banner.link_url ? (
                      <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-burgundy-700 hover:underline">
                        {banner.link_url}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {banner.is_active ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{banner.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/banners/${banner.id}`}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        수정
                      </Link>
                      <form action={deleteBanner}>
                        <input type="hidden" name="id" value={banner.id} />
                        <button
                          type="submit"
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          onClick={(e) => {
                            if (!confirm('정말 삭제하시겠습니까?')) {
                              e.preventDefault()
                            }
                          }}
                        >
                          삭제
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  등록된 배너가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
