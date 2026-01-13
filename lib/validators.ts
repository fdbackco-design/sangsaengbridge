import { z } from 'zod'

export const quoteSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  contact: z.string().min(1, '연락처를 입력해주세요'),
  category: z.string().optional(),
  example_product_link: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
  requirements: z.string().optional(),
  privacy_agreed: z.boolean().refine(val => val === true, '개인정보처리방침에 동의해주세요'),
  honeypot: z.string().max(0, '스팸으로 감지되었습니다').optional(),
})

export const caseSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  slug: z.string().min(1, '슬러그를 입력해주세요'),
  summary: z.string().optional(),
  content_markdown: z.string().optional(),
  category_id: z.string().uuid().optional(),
  thumbnail_image_1: z.string().url().min(1, '썸네일 이미지 1을 업로드해주세요'),
  thumbnail_image_2: z.string().url().optional(),
  detail_image: z.string().url().optional(),
  hashtags: z.array(z.string()).optional(),
  is_featured: z.boolean().default(false),
})

export const bannerSchema = z.object({
  image_url: z.string().url().min(1, '이미지를 업로드해주세요'),
  link_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
})

export const progressSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  image_url: z.string().url().optional(),
  moq: z.string().optional(),
  progress_percent: z.number().int().min(0).max(100).default(0),
  stage: z.enum(['상담', '샘플', '발주', '생산', '배송']),
  stage_date: z.string().optional(),
})

export const pressSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  thumbnail_url: z.string().url().optional(),
  published_date: z.string().optional(),
  summary: z.string().optional(),
  external_link: z.string().url().optional().or(z.literal('')),
})

export const aboutSchema = z.object({
  section_title: z.string().min(1),
  section_description: z.string().optional(),
  strength_1_title: z.string().optional(),
  strength_1_description: z.string().optional(),
  strength_2_title: z.string().optional(),
  strength_2_description: z.string().optional(),
  strength_3_title: z.string().optional(),
  strength_3_description: z.string().optional(),
  strength_4_title: z.string().optional(),
  strength_4_description: z.string().optional(),
})

export const guideStepSchema = z.object({
  step_number: z.number().int().min(1).max(6),
  title: z.string().min(1),
  description: z.string().optional(),
})

export const factoryLocationSchema = z.object({
  title: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
})
