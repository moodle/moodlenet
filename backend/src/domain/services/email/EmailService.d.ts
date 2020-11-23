export type EmailService = {
  api: {}
  ev: {}
  wf: {
    SendOne: {
      ctx: {}
      start: { email: EmailObj; username: string }
      progress: {}
      signal: {}
      end: {
        Success: void
        Fail: void
      }
    }
    VerifyEmail: {
      ctx: {}
      start: { email: EmailObj; maxAttempts: number; tokenReplaceRegEx: string }
      progress: {
        WaitingConfirmation: { attemptCount: number; token: string }
      }
      signal: {
        ConfirmEmail: { token: string }
      }
      end: {
        Confirmed: { c: number }
        Expired: { e: number }
        Aborted: { a: number }
      }
    }
  }
}

export type EmailObj = {
  to: string
  // from: string
  // subject: string
  // text?: string
  // html?: string
}
