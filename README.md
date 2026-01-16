# 상생 브릿지 - Next.js + Supabase 웹사이트

제조업체와 브랜드를 연결하는 플랫폼. Next.js App Router + Supabase 기반의 모바일 최적화 웹사이트입니다.

## 🏗️ 아키텍처 요약

- **프론트엔드**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **백엔드**: Next.js Server Actions / Route Handlers
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth (Magic Link / OTP)
- **스토리지**: Supabase Storage
- **이메일**: Gmail SMTP (Nodemailer)
- **지도**: Google Maps API
- **배포**: Vercel

### 주요 기능

1. **공개 페이지**
   - 메인 페이지 (배너, 성공사례, 진행상황, 소개, 맵, 언론보도, 이용안내)
   - 성공사례 목록/상세 (카테고리 필터)
   - 견적 신청 폼 (파일 업로드, 이메일 발송)

2. **관리자 페이지** (인증 필요)
   - 성공사례 CRUD
   - 배너 CRUD
   - 진행상황 CRUD
   - 언론보도 CRUD
   - 소개 편집
   - 이용안내 편집
   - 공장 위치 관리

## 📋 데이터베이스 스키마

Supabase SQL 파일: `supabase-schema.sql`

### 주요 테이블

- `profiles`: 사용자 프로필 (role: user/admin)
- `banners`: 메인 배너
- `case_categories`: 성공사례 카테고리
- `cases`: 성공사례
- `progress`: 진행상황
- `press`: 언론보도
- `about`: 소개 섹션
- `guide_steps`: 이용안내 스텝
- `factory_locations`: 공장 위치 (구글 맵)
- `quotes`: 견적 신청

### RLS (Row Level Security)

- 모든 콘텐츠는 public read
- admin만 write 가능
- 견적 신청은 public insert, admin만 read

## 🚀 설정 방법

### 1. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase-schema.sql` 실행
3. Storage에서 다음 버킷 생성 (public):
   - `banners`
   - `cases`
   - `progress`
   - `press`
   - `interviews`
   - `uploads`

### 2. 환경변수 설정

`.env.local` 파일 생성:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gmail SMTP
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
QUOTE_RECIPIENT_EMAIL=recipient@example.com

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Vercel 배포 시 환경변수

Vercel 대시보드 → Settings → Environment Variables에서 위 변수들 추가

### 4. 관리자 계정 생성

1. Supabase Auth에서 사용자 생성 (이메일)
2. Supabase SQL Editor에서 실행:

```sql
-- 사용자 ID를 확인한 후
UPDATE profiles SET role = 'admin' WHERE id = 'user_uuid_here';
```

또는 새로 생성:

```sql
-- auth.users에 사용자가 생성된 후
INSERT INTO profiles (id, email, role)
VALUES ('user_uuid_from_auth', 'admin@example.com', 'admin');
```

## 📁 프로젝트 구조

```
app/
  ├── admin/              # 관리자 페이지
  │   ├── cases/          # 성공사례 관리
  │   ├── banners/         # 배너 관리
  │   ├── progress/        # 진행상황 관리
  │   ├── press/           # 언론보도 관리
  │   ├── about/           # 소개 편집
  │   ├── guide/           # 이용안내 편집
  │   ├── locations/       # 공장 위치 관리
  │   └── login/           # 관리자 로그인
  ├── cases/              # 성공사례 공개 페이지
  ├── quote/              # 견적 신청
  └── page.tsx             # 메인 페이지

components/               # 공용 컴포넌트
  ├── Header.tsx
  ├── BottomCTA.tsx
  ├── FloatingCall.tsx
  ├── BannerSlider.tsx
  ├── CaseGrid.tsx
  ├── ProgressCarousel.tsx
  ├── GuideSteps.tsx
  ├── PressList.tsx
  └── MapSection.tsx

lib/
  ├── supabase/           # Supabase 클라이언트
  ├── auth/               # 인증 가드
  ├── storage/            # 파일 업로드
  ├── email.ts            # 이메일 발송
  ├── rate-limit.ts       # Rate limiting
  └── validators.ts       # Zod 스키마
```

## 🔧 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## ✅ 배포 전 체크리스트

### Supabase
- [ ] SQL 스키마 실행 완료
- [ ] Storage 버킷 생성 (banners, cases, progress, press, interviews, uploads)
- [ ] RLS 정책 활성화 확인
- [ ] 관리자 계정 생성 및 role 설정

### 환경변수
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 설정 (서버 전용)
- [ ] `GMAIL_USER` 설정
- [ ] `GMAIL_APP_PASSWORD` 설정 (앱 비밀번호)
- [ ] `QUOTE_RECIPIENT_EMAIL` 설정
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 설정

### Gmail 설정
- [ ] Gmail 2단계 인증 활성화
- [ ] 앱 비밀번호 생성 (Google 계정 → 보안 → 앱 비밀번호)

### Google Maps
- [ ] Google Cloud Console에서 API 키 생성
- [ ] Maps JavaScript API 활성화
- [ ] API 키 제한 설정 (HTTP referrer)

### Vercel
- [ ] 프로젝트 연결
- [ ] 환경변수 모두 설정
- [ ] 빌드 성공 확인
- [ ] 도메인 연결 (선택)

### 기능 테스트
- [ ] 메인 페이지 로드
- [ ] 성공사례 목록/상세 조회
- [ ] 견적 신청 폼 제출
- [ ] 이메일 발송 확인
- [ ] 관리자 로그인
- [ ] 관리자 CRUD 기능
- [ ] 이미지 업로드
- [ ] 구글 맵 표시

## 🎨 디자인 시스템

- **주 색상**: 버건디 (#6B1D2A)
- **배경**: 크림/오프화이트 (#fefdfb)
- **카드**: 라운드 (1rem), 소프트 섀도
- **반응형**: 모바일 퍼스트 (360px 기준)

## 📝 주요 기술 스택

- Next.js 14.1.0
- React 18.2.0
- TypeScript 5.3.3
- Tailwind CSS 3.4.1
- Supabase (Auth, Database, Storage)
- Zod (검증)
- React Hook Form
- Swiper (슬라이더)
- React Markdown
- Google Maps API
- Nodemailer

## 🔒 보안

- RLS로 데이터베이스 접근 제어
- Service Role Key는 서버에서만 사용
- Rate limiting (견적 신청)
- Honeypot (스팸 방지)
- 관리자 인증 (middleware + guard)

## 📞 문의

문제가 발생하면 이슈를 등록해주세요.
