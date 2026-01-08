import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
export const resend = apiKey ? new Resend(apiKey) : null

export async function sendVerificationCode(email: string, code: string) {
  if (!resend) {
    console.error('RESEND_API_KEY is not set')
    return { success: false, error: 'Email service not configured' }
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@quietly.app'

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Verify your email',
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #404040; font-weight: 500; margin: 0 0 24px 0;">Verify your email</h2>
          <p style="color: #737373; line-height: 1.6; margin: 0 0 24px 0;">
            Your verification code is:
          </p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 0 0 24px 0;">
            <span style="font-size: 32px; font-weight: 600; letter-spacing: 8px; color: #171717;">${code}</span>
          </div>
          <p style="color: #a3a3a3; font-size: 14px; line-height: 1.6; margin: 0;">
            This code will expire in 10 minutes.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending verification email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return { success: false, error }
  }
}
