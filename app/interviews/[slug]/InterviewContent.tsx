'use client'

import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

interface InterviewContentProps {
  content: string
}

type BlockType = 'Q' | 'A' | 'RESULT_CARD'

interface ContentBlock {
  type: BlockType
  content: string
}

export default function InterviewContent({ content }: InterviewContentProps) {
  // Q:, A:, 결과 카드를 파싱
  const parseContent = (text: string): ContentBlock[] => {
    const lines = text.split('\n')
    const blocks: ContentBlock[] = []
    let currentBlock: ContentBlock | null = null
    let inResultCard = false
    let resultCardLines: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()

      // 결과 카드 시작 감지 (────────────────)
      if (trimmedLine.match(/^─+$/) && !inResultCard) {
        // 이전 블록 저장
        if (currentBlock) {
          blocks.push(currentBlock)
          currentBlock = null
        }
        inResultCard = true
        resultCardLines = []
        continue
      }

      // 결과 카드 종료 감지
      if (inResultCard && trimmedLine.match(/^─+$/)) {
        if (resultCardLines.length > 0) {
          blocks.push({
            type: 'RESULT_CARD',
            content: resultCardLines.join('\n'),
          })
        }
        inResultCard = false
        resultCardLines = []
        continue
      }

      // 결과 카드 내용 수집 ([결과 요약 카드] 제목은 제외)
      if (inResultCard) {
        if (!trimmedLine.match(/^\[결과 요약 카드\]/i)) {
          resultCardLines.push(line)
        }
        continue
      }

      // Q: 또는 A:로 시작하는 줄 찾기
      const qMatch = trimmedLine.match(/^(\*\*)?Q:(\*\*)?\s*(.+)$/i)
      const aMatch = trimmedLine.match(/^(\*\*)?A:(\*\*)?\s*(.+)$/i)

      if (qMatch) {
        // 이전 블록 저장
        if (currentBlock) blocks.push(currentBlock)
        // 새 질문 블록 시작
        currentBlock = { type: 'Q', content: qMatch[3] || '' }
      } else if (aMatch) {
        // 이전 블록 저장
        if (currentBlock) blocks.push(currentBlock)
        // 새 답변 블록 시작
        currentBlock = { type: 'A', content: aMatch[3] || '' }
      } else if (currentBlock) {
        // 현재 블록에 내용 추가
        if (currentBlock.content) currentBlock.content += '\n' + line
        else currentBlock.content = line
      }
    }

    // 마지막 블록 저장
    if (currentBlock) blocks.push(currentBlock)

    // 결과 카드가 닫히지 않은 경우
    if (inResultCard && resultCardLines.length > 0) {
      blocks.push({
        type: 'RESULT_CARD',
        content: resultCardLines.join('\n'),
      })
    }

    return blocks
  }

  const blocks = parseContent(content)

  // Q와 A를 쌍으로 묶기
  const qaPairs: Array<{ q: ContentBlock; a: ContentBlock | null; resultCard?: ContentBlock }> = []
  let currentQ: ContentBlock | null = null
  let currentA: ContentBlock | null = null

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    
    if (block.type === 'RESULT_CARD') {
      // 결과 카드는 현재 쌍에 추가
      if (currentQ) {
        qaPairs.push({ q: currentQ, a: currentA, resultCard: block })
        currentQ = null
        currentA = null
      } else {
        // Q 없이 결과 카드만 있는 경우
        qaPairs.push({ q: { type: 'Q', content: '' }, a: null, resultCard: block })
      }
    } else if (block.type === 'Q') {
      // 이전 Q-A 쌍 저장
      if (currentQ) {
        qaPairs.push({ q: currentQ, a: currentA })
      }
      currentQ = block
      currentA = null
    } else if (block.type === 'A') {
      currentA = block
    }
  }

  // 마지막 쌍 저장
  if (currentQ) {
    qaPairs.push({ q: currentQ, a: currentA })
  }

  // 블록이 없으면 일반 Markdown으로 표시
  if (blocks.length === 0) {
    return (
      <div className="prose prose-lg max-w-none mb-8 leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="mb-8">
      {qaPairs.map((pair, index) => (
        <QAPair key={index} pair={pair} />
      ))}
    </div>
  )
}

// Q-A 쌍 컴포넌트 (스크롤 애니메이션 포함)
function QAPair({ pair }: { pair: { q: ContentBlock; a: ContentBlock | null; resultCard?: ContentBlock } }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Q */}
      <div className="mb-2">
        <div className="text-lg md:text-xl font-semibold text-gray-900">
          Q. {pair.q.content.trim()}
        </div>
        <div className="border-t border-gray-200 mt-2" />
      </div>

      {/* A */}
      {pair.a && (
        <div className="mb-10">
          <div
            className="prose prose-lg max-w-none leading-relaxed interview-content"
            style={{ lineHeight: '1.7' }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {pair.a.content.trim()}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* 결과 카드 */}
      {pair.resultCard && (
        <div className="my-12 p-6 md:p-8 bg-burgundy-700 text-white rounded-card shadow-card">
          <div className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-p:text-white prose-strong:text-white leading-relaxed interview-content">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {pair.resultCard.content.trim()}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}