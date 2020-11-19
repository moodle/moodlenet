export type EmailService = {
  wf: {
    SendOne: {
      ctx: {}
      start: { email: EmailObj; username: string }
      progress: {}
      end: {
        Success: {}
        Fail: {}
      }
      signal: {}
    }
    VerifyEmail: {
      ctx: {}
      start: { email: EmailObj; maxAttempts: number; tokenReplaceRegEx: string }
      progress: {
        WaitingConfirmation: { attemptCount: number; token: string }
      }
      end: {
        Confirmed: {}
        Expired: {}
        Aborted: {}
      }
      signal: {
        ConfirmEmail: { token: string }
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
