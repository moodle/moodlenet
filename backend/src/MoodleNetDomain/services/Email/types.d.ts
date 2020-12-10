export type EmailObj = {
  to: string
  from: string
  subject: string
  text?: string
  html?: string
}

type VerifyEmailReq = {
  email: EmailObj
  maxAttempts: number
  timeoutSecs: number
}
