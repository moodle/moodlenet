export type EmailService = {
  wf: {
    SendOne: {
      ctx: { email: EmailObj; attemptCount: number; token: string }
      start: { email: EmailObj }
      progress: {}
      end: {
        Success: { id: string }
        Fail: { reason: string }
      }
      signal: {
        dd: { a: string }
      }
    }
  }
  ev: {}
}

export type EmailObj = {
  to: string
  // from: string
  // subject: string
  // text?: string
  // html?: string
}
