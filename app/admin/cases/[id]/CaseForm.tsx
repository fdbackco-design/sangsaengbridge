'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createCase, updateCase } from '../actions'
import { uploadImage } from '@/app/admin/upload/actions'

interface CaseItem {
  id: string
  title: string
  slug: string
  summary?: string | null
  content_markdown?: string | null
  category_id?: string | null
  thumbnail_image_1: string
  thumbnail_image_2?: string | null
  detail_image?: string | null
  hashtags?: string[] | null
  is_featured: boolean
}

interface Category {
  id: string
  name: string
  slug: string
}

interface CaseFormProps {
  caseItem: CaseItem | null
  categories: Category[]
}

// 한글을 로마자로 변환하는 함수
function koreanToSlug(text: string): string {
  const koreanMap: { [key: string]: string } = {
    '가': 'ga', '각': 'gak', '간': 'gan', '갈': 'gal', '감': 'gam', '강': 'gang',
    '개': 'gae', '거': 'geo', '건': 'geon', '걸': 'geol', '검': 'geom', '겁': 'geop',
    '게': 'ge', '겨': 'gyeo', '고': 'go', '곡': 'gok', '곤': 'gon', '골': 'gol',
    '공': 'gong', '과': 'gwa', '광': 'gwang', '구': 'gu', '국': 'guk', '군': 'gun',
    '굴': 'gul', '궁': 'gung', '권': 'gwon', '귀': 'gwi', '규': 'gyu', '균': 'gyun',
    '그': 'geu', '근': 'geun', '글': 'geul', '금': 'geum', '급': 'geup', '기': 'gi',
    '긴': 'gin', '길': 'gil', '김': 'gim', '깅': 'ging', '나': 'na', '낙': 'nak',
    '난': 'nan', '날': 'nal', '남': 'nam', '납': 'nap', '낭': 'nang', '내': 'nae',
    '너': 'neo', '넉': 'neok', '넌': 'neon', '널': 'neol', '넘': 'neom', '네': 'ne',
    '녀': 'nyeo', '녁': 'nyeok', '년': 'nyeon', '녕': 'nyeong', '노': 'no', '녹': 'nok',
    '논': 'non', '놀': 'nol', '농': 'nong', '뇌': 'noe', '누': 'nu', '눈': 'nun',
    '눌': 'nul', '뉴': 'nyu', '뉵': 'nyuk', '느': 'neu', '늑': 'neuk', '는': 'neun',
    '늘': 'neul', '능': 'neung', '니': 'ni', '닉': 'nik', '닌': 'nin', '닐': 'nil',
    '다': 'da', '닥': 'dak', '단': 'dan', '달': 'dal', '담': 'dam', '답': 'dap',
    '당': 'dang', '대': 'dae', '댁': 'daek', '더': 'deo', '덕': 'deok', '던': 'deon',
    '덜': 'deol', '덤': 'deom', '데': 'de', '도': 'do', '독': 'dok', '돈': 'don',
    '돌': 'dol', '동': 'dong', '두': 'du', '둑': 'duk', '둔': 'dun', '둘': 'dul',
    '뒤': 'dwi', '드': 'deu', '득': 'deuk', '든': 'deun', '들': 'deul', '등': 'deung',
    '디': 'di', '딕': 'dik', '라': 'ra', '락': 'rak', '란': 'ran', '랄': 'ral',
    '람': 'ram', '랍': 'rap', '랑': 'rang', '래': 'rae', '랙': 'raek', '러': 'reo',
    '럭': 'reok', '런': 'reon', '럴': 'reol', '럼': 'reom', '레': 're', '려': 'ryeo',
    '력': 'ryeok', '련': 'ryeon', '렬': 'ryeol', '렴': 'ryeom', '렵': 'ryeop', '령': 'ryeong',
    '로': 'ro', '록': 'rok', '론': 'ron', '롤': 'rol', '롬': 'rom', '롱': 'rong',
    '뢰': 'roe', '료': 'ryo', '루': 'ru', '룩': 'ruk', '룬': 'run', '룰': 'rul',
    '뤄': 'rwo', '류': 'ryu', '륙': 'ryuk', '륜': 'ryun', '률': 'ryul', '륨': 'ryum',
    '르': 'reu', '륵': 'reuk', '른': 'reun', '를': 'reul', '름': 'reum', '릅': 'reup',
    '리': 'ri', '릭': 'rik', '린': 'rin', '릴': 'ril', '림': 'rim', '립': 'rip',
    '마': 'ma', '막': 'mak', '만': 'man', '말': 'mal', '맘': 'mam', '맙': 'map',
    '망': 'mang', '매': 'mae', '맥': 'maek', '맨': 'maen', '맬': 'mael', '맴': 'maem',
    '맵': 'maep', '맹': 'maeng', '머': 'meo', '먹': 'meok', '먼': 'meon', '멀': 'meol',
    '멈': 'meom', '멍': 'meong', '메': 'me', '멱': 'myeok', '며': 'myeo', '멸': 'myeol',
    '면': 'myeon', '명': 'myeong', '모': 'mo', '목': 'mok', '몬': 'mon',
    '몰': 'mol', '몸': 'mom', '몹': 'mop', '몽': 'mong', '뫼': 'moe', '묘': 'myo',
    '무': 'mu', '묵': 'muk', '문': 'mun', '물': 'mul', '뭄': 'mum', '뭅': 'mup',
    '뮤': 'myu', '므': 'meu', '믈': 'meul', '미': 'mi', '믹': 'mik', '민': 'min',
    '밀': 'mil', '밈': 'mim', '밉': 'mip', '바': 'ba', '박': 'bak', '반': 'ban',
    '발': 'bal', '밤': 'bam', '밥': 'bap', '방': 'bang', '배': 'bae', '백': 'baek',
    '뱀': 'baem', '뱁': 'baep', '버': 'beo', '벅': 'beok', '번': 'beon', '벌': 'beol',
    '범': 'beom', '법': 'beop', '벙': 'beong', '베': 'be', '벡': 'bek', '벤': 'ben',
    '벨': 'bel', '벰': 'bem', '벱': 'bep', '벵': 'beng', '변': 'byeon', '별': 'byeol',
    '볍': 'byeop', '병': 'byeong', '보': 'bo', '복': 'bok', '본': 'bon', '볼': 'bol',
    '봄': 'bom', '봉': 'bong', '부': 'bu', '북': 'buk', '분': 'bun', '불': 'bul',
    '붐': 'bum', '붑': 'bup', '붕': 'bung', '뷰': 'byu', '브': 'beu', '븍': 'beuk',
    '븐': 'beun', '블': 'beul', '븜': 'beum', '비': 'bi', '빅': 'bik', '빈': 'bin',
    '빌': 'bil', '빔': 'bim', '빕': 'bip', '빙': 'bing', '사': 'sa', '삭': 'sak',
    '산': 'san', '살': 'sal', '삼': 'sam', '삽': 'sap', '상': 'sang', '새': 'sae',
    '색': 'saek', '생': 'saeng', '서': 'seo', '석': 'seok', '선': 'seon', '설': 'seol',
    '섬': 'seom', '섭': 'seop', '성': 'seong', '세': 'se', '셔': 'syeo', '소': 'so',
    '속': 'sok', '손': 'son', '솔': 'sol', '솜': 'som', '송': 'song', '쇄': 'swae',
    '쇠': 'soe', '수': 'su', '숙': 'suk', '순': 'sun', '술': 'sul', '숨': 'sum',
    '숩': 'sup', '숭': 'sung', '쉬': 'swi', '슈': 'syu', '스': 'seu', '슥': 'seuk',
    '슨': 'seun', '슬': 'seul', '슴': 'seum', '습': 'seup', '시': 'si', '식': 'sik',
    '신': 'sin', '실': 'sil', '심': 'sim', '십': 'sip', '싱': 'sing', '아': 'a',
    '악': 'ak', '안': 'an', '알': 'al', '암': 'am', '압': 'ap', '앙': 'ang',
    '애': 'ae', '액': 'aek', '앤': 'aen', '앨': 'ael', '앰': 'aem', '앱': 'aep',
    '앵': 'aeng', '야': 'ya', '약': 'yak', '얀': 'yan', '얄': 'yal', '얌': 'yam',
    '양': 'yang', '어': 'eo', '억': 'eok', '언': 'eon', '얼': 'eol', '엄': 'eom',
    '업': 'eop', '에': 'e', '엑': 'ek', '엔': 'en', '엘': 'el', '엠': 'em',
    '엡': 'ep', '영': 'yeong', '예': 'ye', '옥': 'ok', '온': 'on', '올': 'ol',
    '옴': 'om', '옵': 'op', '옹': 'ong', '와': 'wa', '왁': 'wak', '완': 'wan',
    '왈': 'wal', '왕': 'wang', '왜': 'wae', '외': 'oe', '요': 'yo', '욕': 'yok',
    '용': 'yong', '우': 'u', '욱': 'uk', '운': 'un', '울': 'ul', '움': 'um',
    '웅': 'ung', '워': 'wo', '원': 'won', '월': 'wol', '웜': 'wom', '웝': 'wop',
    '위': 'wi', '윅': 'wik', '윈': 'win', '율': 'yul', '윤': 'yun', '융': 'yung',
    '으': 'eu', '윽': 'euk', '은': 'eun', '을': 'eul', '음': 'eum', '읍': 'eup',
    '응': 'eung', '의': 'ui', '이': 'i', '익': 'ik', '인': 'in', '일': 'il',
    '임': 'im', '입': 'ip', '잉': 'ing', '자': 'ja', '작': 'jak', '잔': 'jan',
    '잘': 'jal', '잠': 'jam', '잡': 'jap', '장': 'jang', '재': 'jae', '쟁': 'jaeng',
    '저': 'jeo', '적': 'jeok', '전': 'jeon', '절': 'jeol', '점': 'jeom', '접': 'jeop',
    '정': 'jeong', '제': 'je', '조': 'jo', '족': 'jok', '존': 'jon', '졸': 'jol',
    '종': 'jong', '좌': 'jwa', '죄': 'joe', '주': 'ju', '죽': 'juk', '준': 'jun',
    '줄': 'jul', '줌': 'jum', '중': 'jung', '쥐': 'jwi', '즈': 'jeu', '즉': 'jeuk',
    '즌': 'jeun', '즐': 'jeul', '즘': 'jeum', '즙': 'jeup', '증': 'jeung', '지': 'ji',
    '직': 'jik', '진': 'jin', '질': 'jil', '짐': 'jim', '집': 'jip', '징': 'jing',
    '차': 'cha', '착': 'chak', '찬': 'chan', '찰': 'chal', '참': 'cham', '찹': 'chap',
    '창': 'chang', '채': 'chae', '책': 'chaek', '챔': 'chaem', '처': 'cheo', '척': 'cheok',
    '천': 'cheon', '철': 'cheol', '첨': 'cheom', '첩': 'cheop', '청': 'cheong', '체': 'che',
    '초': 'cho', '촉': 'chok', '촌': 'chon', '총': 'chong', '촬': 'chwal', '최': 'choe',
    '추': 'chu', '축': 'chuk', '춘': 'chun', '출': 'chul', '춤': 'chum', '충': 'chung',
    '취': 'chwi', '측': 'cheuk', '츤': 'cheun', '츨': 'cheul', '츰': 'cheum', '치': 'chi',
    '칙': 'chik', '친': 'chin', '칠': 'chil', '침': 'chim', '칩': 'chip', '칭': 'ching',
    '카': 'ka', '칵': 'kak', '칸': 'kan', '칼': 'kal', '캄': 'kam', '캅': 'kap',
    '캐': 'kae', '커': 'keo', '컥': 'keok', '컨': 'keon', '컬': 'keol', '컴': 'keom',
    '컵': 'keop', '컹': 'keong', '케': 'ke', '켁': 'kek', '켄': 'ken', '켈': 'kel',
    '켐': 'kem', '켑': 'kep', '켕': 'keng', '코': 'ko', '콕': 'kok', '콘': 'kon',
    '콜': 'kol', '콤': 'kom', '콥': 'kop', '콩': 'kong', '쾌': 'kwae', '쿠': 'ku',
    '퀵': 'kwik', '쿤': 'kun', '쿨': 'kul', '쿰': 'kum', '쿱': 'kup', '쿵': 'kung',
    '쿼': 'kwo', '퀀': 'kwen', '크': 'keu', '큭': 'keuk', '큰': 'keun', '클': 'keul',
    '큼': 'keum', '큽': 'keup', '킁': 'keung', '키': 'ki', '킥': 'kik', '킨': 'kin',
    '킬': 'kil', '킴': 'kim', '킵': 'kip', '킹': 'king', '타': 'ta', '탁': 'tak',
    '탄': 'tan', '탈': 'tal', '탐': 'tam', '탑': 'tap', '탕': 'tang', '태': 'tae',
    '택': 'taek', '탱': 'taeng', '터': 'teo', '턱': 'teok', '턴': 'teon', '털': 'teol',
    '텀': 'teom', '텁': 'teop', '텅': 'teong', '테': 'te', '텍': 'tek', '텐': 'ten',
    '텔': 'tel', '템': 'tem', '텝': 'tep', '텡': 'teng', '토': 'to', '톡': 'tok',
    '톤': 'ton', '톨': 'tol', '톰': 'tom', '톱': 'top', '통': 'tong', '퇴': 'toe',
    '투': 'tu', '툭': 'tuk', '툰': 'tun', '툴': 'tul', '툼': 'tum', '툽': 'tup',
    '퉁': 'tung', '튀': 'twi', '튁': 'twik', '튄': 'twin', '튈': 'twil', '튐': 'twim',
    '튑': 'twip', '튕': 'twing', '트': 'teu', '특': 'teuk', '튼': 'teun',
    '틀': 'teul', '틈': 'teum', '틉': 'teup', '틍': 'teung', '티': 'ti', '틱': 'tik',
    '틴': 'tin', '틸': 'til', '팀': 'tim', '팁': 'tip', '팅': 'ting', '파': 'pa',
    '팍': 'pak', '판': 'pan', '팔': 'pal', '팜': 'pam', '팝': 'pap', '팡': 'pang',
    '패': 'pae', '팩': 'paek', '팬': 'paen', '팰': 'pael', '팸': 'paem', '팹': 'paep',
    '팽': 'paeng', '퍼': 'peo', '퍽': 'peok', '펀': 'peon', '펄': 'peol', '펌': 'peom',
    '펍': 'peop', '펑': 'peong', '페': 'pe', '펙': 'pek', '펜': 'pen', '펠': 'pel',
    '펨': 'pem', '펩': 'pep', '펭': 'peng', '편': 'pyeon', '펼': 'pyeol', '폄': 'pyeom',
    '폅': 'pyeop', '평': 'pyeong', '폐': 'pye', '포': 'po', '폭': 'pok', '폰': 'pon',
    '폴': 'pol', '폼': 'pom', '폽': 'pop', '퐁': 'pong', '표': 'pyo', '푸': 'pu',
    '푹': 'puk', '풀': 'pul', '품': 'pum', '풉': 'pup', '풍': 'pung', '퓨': 'pyu',
    '프': 'peu', '픽': 'pik', '플': 'peul', '픔': 'peum', '픕': 'peup', '피': 'pi',
    '핀': 'pin', '필': 'pil', '핌': 'pim', '핍': 'pip', '핑': 'ping',
    '하': 'ha', '학': 'hak', '한': 'han', '할': 'hal', '함': 'ham', '합': 'hap',
    '항': 'hang', '해': 'hae', '핵': 'haek', '핸': 'haen', '핼': 'hael', '햄': 'haem',
    '햅': 'haep', '행': 'haeng', '향': 'hyang', '허': 'heo', '헉': 'heok', '헌': 'heon',
    '헐': 'heol', '헒': 'heom', '헙': 'heop', '헝': 'heong', '헤': 'he', '헥': 'hek',
    '헨': 'hen', '헬': 'hel', '헴': 'hem', '헵': 'hep', '헹': 'heng', '혀': 'hyeo',
    '혁': 'hyeok', '현': 'hyeon', '혈': 'hyeol', '혐': 'hyeom', '협': 'hyeop', '형': 'hyeong',
    '혜': 'hye', '혹': 'hok', '혼': 'hon', '홀': 'hol', '홈': 'hom', '홉': 'hop',
    '홍': 'hong', '화': 'hwa', '확': 'hwak', '환': 'hwan', '활': 'hwal', '홧': 'hwat',
    '황': 'hwang', '홰': 'hwae', '회': 'hoe', '획': 'hoek', '횟': 'hoet', '횡': 'hoeng',
    '효': 'hyo', '후': 'hu', '훅': 'huk', '훈': 'hun', '훌': 'hul', '훔': 'hum',
    '훕': 'hup', '훙': 'hung', '훠': 'hwo', '훤': 'hwon', '훨': 'hwol', '훰': 'hwom',
    '훱': 'hwop', '훵': 'hwong', '훼': 'hwe', '훽': 'hwek', '휀': 'hwen', '휄': 'hwel',
    '휌': 'hwem', '휍': 'hwep', '휑': 'hweng', '휘': 'hwi', '휙': 'hwik', '휜': 'hwin',
    '휠': 'hwil', '휨': 'hwim', '휩': 'hwip', '휭': 'hwing', '휴': 'hyu', '휵': 'hyuk',
    '휸': 'hyun', '휼': 'hyul', '흄': 'hyum', '흉': 'hyung', '흐': 'heu', '흑': 'heuk',
    '흔': 'heun', '흘': 'heul', '흙': 'heulk', '흠': 'heum', '흡': 'heup', '흥': 'heung',
    '흩': 'heut', '희': 'hui', '흰': 'huin', '흴': 'huil', '흼': 'huim', '흽': 'huip',
    '힁': 'huing', '히': 'hi', '힉': 'hik', '힌': 'hin', '힐': 'hil', '힘': 'him',
    '힙': 'hip', '힝': 'hing'
  }

  return text
    .split('')
    .map((char) => {
      // 한글인 경우 변환
      if (/[가-힣]/.test(char)) {
        // 맵에 있으면 변환, 없으면 제거 (한글이 그대로 남지 않도록)
        return koreanMap[char] || ''
      }
      // 영어나 숫자는 그대로
      if (/[a-zA-Z0-9]/.test(char)) {
        return char.toLowerCase()
      }
      // 공백은 하이픈으로
      if (/\s/.test(char)) {
        return '-'
      }
      // 특수문자는 제거
      return ''
    })
    .join('')
    .replace(/-+/g, '-') // 연속된 하이픈을 하나로
    .replace(/^-|-$/g, '') // 앞뒤 하이픈 제거
    .toLowerCase()
}

export default function CaseForm({ caseItem, categories }: CaseFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: caseItem?.title || '',
    slug: caseItem?.slug || '',
    summary: caseItem?.summary || '',
    content_markdown: caseItem?.content_markdown || '',
    category_id: caseItem?.category_id || '',
    thumbnail_image_1: caseItem?.thumbnail_image_1 || '',
    thumbnail_image_2: caseItem?.thumbnail_image_2 || '',
    detail_image: caseItem?.detail_image || '',
    hashtags: caseItem?.hashtags?.join(', ') || '',
    is_featured: caseItem?.is_featured || false,
  })

  // 제목 변경 시 슬러그 자동 생성
  const handleTitleChange = (title: string) => {
    setFormData((prev) => {
      // 새 항목이거나 기존 항목이어도 슬러그를 자동 생성
      return { ...prev, title, slug: koreanToSlug(title) }
    })
  }

  const handleFileUpload = async (field: string, file: File) => {
    setUploading(field)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'cases')

      const result = await uploadImage(formData)
      if (!result.success || !result.url) {
        setError(`파일 업로드 실패: ${result.error || '알 수 없는 오류'}`)
        return
      }

      setFormData((prev) => ({ ...prev, [field]: result.url! }))
    } catch (err) {
      setError('파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, value.toString())
      }
    })

    startTransition(async () => {
      const result = caseItem
        ? await updateCase(caseItem.id, form)
        : await createCase(form)

      if (result.success) {
        router.push('/admin/cases')
        router.refresh()
      } else {
        setError(result.error || '저장에 실패했습니다.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-card shadow-soft p-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-card text-red-800">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
        />
      </div>

      {/* 슬러그는 자동 생성되므로 숨김 */}
      <input type="hidden" name="slug" value={formData.slug} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">요약</label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
        >
          <option value="">선택해주세요</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          썸네일 이미지 1 <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload('thumbnail_image_1', file)
          }}
          disabled={uploading === 'thumbnail_image_1'}
          className="w-full px-4 py-2 border border-gray-300 rounded-button"
        />
        {formData.thumbnail_image_1 && (
          <div className="relative w-32 h-32 mt-2">
            <Image
              src={formData.thumbnail_image_1}
              alt="썸네일 1"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        {uploading === 'thumbnail_image_1' && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">썸네일 이미지 2</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload('thumbnail_image_2', file)
          }}
          disabled={uploading === 'thumbnail_image_2'}
          className="w-full px-4 py-2 border border-gray-300 rounded-button"
        />
        {formData.thumbnail_image_2 && (
          <div className="relative w-32 h-32 mt-2">
            <Image
              src={formData.thumbnail_image_2}
              alt="썸네일 2"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        {uploading === 'thumbnail_image_2' && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">상세 이미지</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload('detail_image', file)
          }}
          disabled={uploading === 'detail_image'}
          className="w-full px-4 py-2 border border-gray-300 rounded-button"
        />
        {formData.detail_image && (
          <div className="relative w-64 h-64 mt-2">
            <Image
              src={formData.detail_image}
              alt="상세 이미지"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        {uploading === 'detail_image' && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">해시태그 (쉼표로 구분)</label>
        <input
          type="text"
          value={formData.hashtags}
          onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          placeholder="태그1, 태그2, 태그3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">본문 (Markdown)</label>
        <textarea
          value={formData.content_markdown}
          onChange={(e) => setFormData({ ...formData, content_markdown: e.target.value })}
          rows={10}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
          />
          <span className="text-sm text-gray-700">추천 항목으로 표시</span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-burgundy-700 text-white rounded-button hover:bg-burgundy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-button hover:bg-gray-300 transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}
