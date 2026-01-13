import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import Link from 'next/link'
import { deletePress } from './actions'

export default async function AdminPressPage() {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { data: press } = await supabase
    .from('press')
    .select('*')
    .order('published_date', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">언론보도 관리</h1>
        <Link
          href="/admin/press/new"
          className="px-4 py-2 bg-burgundy-700 text-white rounded-button hover:bg-burgundy-800 transition-colors"
        >
          새로 만들기
        </Link>
      </div>

      <div className="bg-white rounded-card shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">제목</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">발행일</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">작성일</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {press && press.length > 0 ? (
              press.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.published_date ? new Date(item.published_date).toLocaleDateString('ko-KR') : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(item.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/press/${item.id}`}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        수정
                      </Link>
                      <form action={deletePress}>
                        <input type="hidden" name="id" value={item.id} />
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
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  등록된 언론보도가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
