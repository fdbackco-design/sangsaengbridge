import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import Link from 'next/link'
import Image from 'next/image'
import DeleteButton from './DeleteButton'

export default async function AdminInterviewsPage() {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { data: interviews } = await supabase
    .from('interviews')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">인터뷰 관리</h1>
        <Link
          href="/admin/interviews/new"
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">정렬 순서</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">활성화</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">작성일</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {interviews && interviews.length > 0 ? (
              interviews.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    {item.image_url ? (
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                        없음
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{item.sort_order}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {item.is_active ? (
                      <span className="text-green-600">활성</span>
                    ) : (
                      <span className="text-gray-400">비활성</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/interviews/${item.id}`}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        수정
                      </Link>
                      <DeleteButton id={item.id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  등록된 인터뷰가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
