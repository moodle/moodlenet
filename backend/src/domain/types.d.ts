export type MoodleDomain = {
  name: 'MoodleDomain'
  services: {
    Accounting: {
      wf: {
        RegisterNewAccount: {
          context: { email: string; username: string }
          enqueue: { email: string; username: string }
          progress: {
            WaitingConfirmEmail: { x: 22 }
            aWaitingConfirmEmail: { a: 1 }
          }
          end: {
            AccountActivated: void
            Rejected: { reason: string }
          }
          signal: {}
        }
        VerifyAccountEmail: {
          context: { email: EmailObj; attemptCount: number; token: string }
          enqueue: { email: EmailObj }
          progress: {
            EmailSent: void
          }
          end: {
            Confirmed: void
            Expired: void
            Aborted: { reason: string }
          }
          signal: {
            Abort: { reason: string }
          }
        }
      }
      ev: {
        XX: { a: number }
        YY: { b: string }
      }
    }
    // Email: {
    //   Send: {
    //     wf: {
    //       simpleEmail: Sync<EmailObj, { emailId: string }, { error: string }>
    //     }
    //     ev: {}
    //   }
    // }
  }
}
export type EmailObj = {
  to: string
  from: string
  subject: string
  text?: string
  html?: string
}
