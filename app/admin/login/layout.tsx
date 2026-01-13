// 로그인 페이지는 admin layout을 사용하지 않음
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
