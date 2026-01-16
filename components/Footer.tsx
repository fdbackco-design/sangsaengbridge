export default function Footer() {
  return (
    <footer className="bg-burgundy-700 text-white mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">회사 정보</h3>
            <div className="space-y-2 text-sm md:text-base">
              <p>
                <span className="font-semibold">상호명:</span> 주식회사 상생
              </p>
              <p>
                <span className="font-semibold">사업자등록번호:</span> 884-81-03587
              </p>
              <p>
                <span className="font-semibold">대표자:</span> 정성현
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">사업장 위치</h3>
            <p className="text-sm md:text-base">
              인천광역시 연수구 송도동 172-1 송도테크노파크IT센터, S동 3003-3호
            </p>
          </div>
        </div>
        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-burgundy-600 text-center text-xs md:text-sm text-gray-200">
          <p>© {new Date().getFullYear()} 주식회사 상생. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
