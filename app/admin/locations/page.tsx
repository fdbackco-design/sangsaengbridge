import { requireAdmin } from '@/lib/auth/guard'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { deleteLocation } from './actions'

export default async function LocationsPage() {
  await requireAdmin()
  const supabase = createClient()

  const { data: locations } = await supabase
    .from('factory_locations')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">공장 위치 관리</h1>
        <Link
          href="/admin/locations/new"
          className="px-4 py-2 bg-burgundy-700 text-white rounded-button hover:bg-burgundy-800 transition-colors"
        >
          새 위치 추가
        </Link>
      </div>

      {locations && locations.length > 0 ? (
        <div className="bg-white rounded-card shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-cream-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">제목</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">주소</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">위도</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">경도</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {locations.map((location) => (
                <tr key={location.id} className="hover:bg-cream-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{location.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{location.address || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{location.latitude}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{location.longitude}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/locations/${location.id}`}
                        className="px-3 py-1 text-sm text-burgundy-700 hover:bg-burgundy-50 rounded-button transition-colors"
                      >
                        수정
                      </Link>
                      <form action={deleteLocation} className="inline">
                        <input type="hidden" name="id" value={location.id} />
                        <button
                          type="submit"
                          onClick={(e) => {
                            if (!confirm('정말 삭제하시겠습니까?')) {
                              e.preventDefault()
                            }
                          }}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-button transition-colors"
                        >
                          삭제
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-card shadow-soft p-8 text-center text-gray-500">
          등록된 공장 위치가 없습니다.
        </div>
      )}
    </div>
  )
}
