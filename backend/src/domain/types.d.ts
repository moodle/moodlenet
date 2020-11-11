export type MoodleDomain = {
  name: 'MoodleDomain'
  services: {
    Accounting: {
      wf: {
        RegisterNewAccount: {
          context: { ctx: string; email: string; username: string }
          enqueue: { email: string; username: string }
          progress: {
            WaitingConfirmEmail: { WaitingConfirmEmail: 'WaitingConfirmEmail' }
            aWaitingConfirmEmail: { aWaitingConfirmEmail: 'aWaitingConfirmEmail' }
          }
          end: {
            AccountActivated: { AccountActivated: 'AccountActivated' }
            Rejected: { reason: string }
          }
          signal: {}
        }
        VerifyAccountEmail: {
          context: { email: EmailObj; attemptCount: number; token: string }
          enqueue: { email: EmailObj }
          progress: {
            EmailSent: { EmailSent: 'EmailSent' }
          }
          end: {
            Confirmed: { Confirmed: 'Confirmed' }
            Expired: { Expired: 'Expired' }
            Aborted: { reason: string }
          }
          signal: {}
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
