export type SendEmailJobReq = {
  to: string
  from: string
  subject: string
  text?: string
  html?: string
}

export type SendEmailProgress = {
  SendEmailProgressOK: { id: string }
  SendEmailProgressKO: { error: string }
}
