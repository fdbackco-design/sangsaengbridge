import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import Link from 'next/link'
import DeleteButton from './DeleteButton'

export default async function AdminProgressPage() {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { data: progress } = await supabase
    .from('progress')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">진행상황 관리</h1>
        <Link
          href="/admin/progress/new"
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">단계</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">진행률</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">작성일</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {progress && progress.length > 0 ? (
              progress.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{item.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{item.stage}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{item.progress_percent}%</td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/progress/${item.id}`}
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
                  등록된 진행상황이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
