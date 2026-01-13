import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // 앱 비밀번호 사용
  },
})

export async function sendQuoteEmail(data: {
  name: string
  contact: string
  category?: string
  example_product_link?: string
  requirements?: string
  file_url?: string
}) {
  const recipientEmail = process.env.QUOTE_RECIPIENT_EMAIL || process.env.GMAIL_USER

  const htmlContent = `
    <h2>새로운 견적 신청이 접수되었습니다</h2>
    <hr>
    <p><strong>이름:</strong> ${data.name}</p>
    <p><strong>연락처:</strong> ${data.contact}</p>
    ${data.category ? `<p><strong>카테고리:</strong> ${data.category}</p>` : ''}
    ${data.example_product_link ? `<p><strong>예시 제품 링크:</strong> <a href="${data.example_product_link}">${data.example_product_link}</a></p>` : ''}
    ${data.requirements ? `<p><strong>요청사항:</strong><br>${data.requirements.replace(/\n/g, '<br>')}</p>` : ''}
    ${data.file_url ? `<p><strong>첨부 파일:</strong> <a href="${data.file_url}">다운로드</a></p>` : ''}
    <hr>
    <p><small>이 이메일은 상생 브릿지 견적 신청 시스템에서 자동으로 발송되었습니다.</small></p>
  `

  try {
    await transporter.sendMail({
      from: `"상생 브릿지" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: `[견적 신청] ${data.name}님의 견적 요청`,
      html: htmlContent,
    })

    return { success: true, error: null }
  } catch (error) {
    console.error('이메일 발송 오류:', error)
    return { success: false, error: '이메일 발송에 실패했습니다.' }
  }
}
