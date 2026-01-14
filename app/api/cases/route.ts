import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  const { data: cases, error } = await supabase
    .from('cases')
    .select(`
      id,
      title,
      slug,
      summary,
      thumbnail_image_1,
      hashtags,
      category:case_categories(name, slug)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ cases: cases || [] })
}
