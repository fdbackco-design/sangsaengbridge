-- ============================================
-- 상생브릿지 데이터베이스 스키마
-- ============================================

-- 1. 프로필 테이블 (인증 확장)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 배너 테이블
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2-1. 중간 배너 테이블
CREATE TABLE IF NOT EXISTS middle_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 성공사례 카테고리 (enum 대신 테이블로 관리)
CREATE TABLE IF NOT EXISTS case_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 카테고리 삽입
INSERT INTO case_categories (name, slug) VALUES
  ('생활용품', 'living'),
  ('주방용품', 'kitchen'),
  ('화장품용기', 'cosmetic'),
  ('기타', 'other')
ON CONFLICT (slug) DO NOTHING;

-- 4. 성공사례 테이블
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content_markdown TEXT,
  category_id UUID REFERENCES case_categories(id),
  thumbnail_image_1 TEXT NOT NULL,
  thumbnail_image_2 TEXT,
  detail_image TEXT,
  hashtags TEXT[], -- 배열 타입
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 진행상황 테이블
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  moq TEXT, -- 최소 주문 수량
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  stage TEXT NOT NULL CHECK (stage IN ('상담', '샘플', '발주', '생산', '배송')),
  stage_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 언론보도 테이블
CREATE TABLE IF NOT EXISTS press (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  published_date DATE,
  summary TEXT,
  external_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 소개(About) 테이블
CREATE TABLE IF NOT EXISTS about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_title TEXT NOT NULL DEFAULT '상생 브릿지는?',
  section_description TEXT,
  strength_1_title TEXT,
  strength_1_description TEXT,
  strength_1_image_url TEXT,
  strength_2_title TEXT,
  strength_2_description TEXT,
  strength_2_image_url TEXT,
  strength_3_title TEXT,
  strength_3_description TEXT,
  strength_3_image_url TEXT,
  strength_4_title TEXT,
  strength_4_description TEXT,
  strength_4_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 About 데이터 삽입
INSERT INTO about (id, section_title, section_description) VALUES
  (gen_random_uuid(), '상생 브릿지는?', '제조업체와 브랜드를 연결하는 플랫폼입니다.')
ON CONFLICT DO NOTHING;

-- 8. 이용안내 스텝 테이블
CREATE TABLE IF NOT EXISTS guide_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number INTEGER NOT NULL CHECK (step_number >= 1 AND step_number <= 6),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(step_number)
);

-- 9. 인터뷰 테이블
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  summary TEXT,
  content_markdown TEXT,
  closing_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 스텝 데이터 삽입
INSERT INTO guide_steps (step_number, title, description) VALUES
  (1, '견적 신청', '원하시는 제품의 견적을 요청해주세요.'),
  (2, '상담 진행', '상담을 통해 브랜딩과 제품 견적, 샘플을 신청하실 수 있습니다.'),
  (3, '발주 진행', '확정된 업체로 발주를 진행합니다.'),
  (4, '생산 및 제품 검수', '생산 후 꼼꼼한 검수와 함께 고객님께 촬영본을 보내드립니다.'),
  (5, '국제 배송 및 통관', '신속하게 국제 배송 및 통관 절차를 거쳐 창고에 입고됩니다.'),
  (6, '국내 배송 및 AS 대응', '국내 고객님들께 제품이 배송되며 AS를 책임지고 해결합니다.')
ON CONFLICT (step_number) DO NOTHING;

-- 9. 공장 위치 테이블 (구글 맵용)
CREATE TABLE IF NOT EXISTS factory_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. 견적 신청 테이블
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  category TEXT,
  example_product_link TEXT,
  requirements TEXT,
  file_url TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_cases_category ON cases(category_id);
CREATE INDEX IF NOT EXISTS idx_cases_slug ON cases(slug);
CREATE INDEX IF NOT EXISTS idx_cases_featured ON cases(is_featured);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_middle_banners_active ON middle_banners(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_progress_stage ON progress(stage);
CREATE INDEX IF NOT EXISTS idx_press_date ON press(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON quotes(created_at DESC);

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_middle_banners_updated_at BEFORE UPDATE ON middle_banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_press_updated_at BEFORE UPDATE ON press
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_updated_at BEFORE UPDATE ON about
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guide_steps_updated_at BEFORE UPDATE ON guide_steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE middle_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE press ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE factory_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- 1. Profiles 정책
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. Banners 정책
CREATE POLICY "Banners are viewable by everyone"
  ON banners FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert banners"
  ON banners FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update banners"
  ON banners FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete banners"
  ON banners FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2-1. Middle Banners 정책
CREATE POLICY "Middle banners are viewable by everyone"
  ON middle_banners FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert middle banners"
  ON middle_banners FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update middle banners"
  ON middle_banners FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete middle banners"
  ON middle_banners FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Case Categories 정책
CREATE POLICY "Case categories are viewable by everyone"
  ON case_categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage case categories"
  ON case_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Cases 정책
CREATE POLICY "Cases are viewable by everyone"
  ON cases FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert cases"
  ON cases FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update cases"
  ON cases FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete cases"
  ON cases FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Progress 정책
CREATE POLICY "Progress items are viewable by everyone"
  ON progress FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage progress"
  ON progress FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Press 정책
CREATE POLICY "Press items are viewable by everyone"
  ON press FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage press"
  ON press FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. About 정책
CREATE POLICY "About is viewable by everyone"
  ON about FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update about"
  ON about FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. Guide Steps 정책
CREATE POLICY "Guide steps are viewable by everyone"
  ON guide_steps FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update guide steps"
  ON guide_steps FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 9. Factory Locations 정책
CREATE POLICY "Factory locations are viewable by everyone"
  ON factory_locations FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage factory locations"
  ON factory_locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 10. Interviews 정책
CREATE POLICY "Interviews are viewable by everyone"
  ON interviews FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can manage interviews"
  ON interviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 11. Quotes 정책
CREATE POLICY "Anyone can insert quotes"
  ON quotes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view quotes"
  ON quotes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
