import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import Link from 'next/link'
import Image from 'next/image'
import { deleteCase } from './actions'

export default async function AdminCasesPage() {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { data: cases } = await supabase
    .from('cases')
    .select(`
      *,
      category:case_categories(*)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">성공사례 관리</h1>
        <Link
          href="/admin/cases/new"
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">제목</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">카테고리</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">작성일</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cases && cases.length > 0 ? (
              cases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td className="px-4 py-3">
                    <div className="relative w-16 h-16">
                      <Image
                        src={caseItem.thumbnail_image_1}
                        alt={caseItem.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/cases/${caseItem.id}`}
                      className="text-burgundy-700 hover:text-burgundy-800 font-medium"
                    >
                      {caseItem.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {caseItem.category?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(caseItem.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/cases/${caseItem.id}`}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        수정
                      </Link>
                      <form action={deleteCase}>
                        <input type="hidden" name="id" value={caseItem.id} />
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
                  등록된 성공사례가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
