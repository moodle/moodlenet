export type MoodleDomain = {
  name: 'MoodleDomain'
  services: {
    Accounting: {
      wf: {
        RegisterNewAccount: {
          context: { email: string; username: string }
          enqueue: { email: string; username: string }
          progress: {
            WaitingConfirmEmail: { _end: false }
            aWaitingConfirmEmail: { _end: false }
            AccountActivated: { _end: true }
            Rejected: { _end: true; reason: string }
          }
          signal: {}
        }
        VerifyAccountEmail: {
          context: { email: EmailObj; attemptCount: number; token: string }
          enqueue: { email: EmailObj }
          progress: {
            EmailSent: { _end: false }
            Confirmed: { _end: true }
            Expired: { _end: true }
            Aborted: { _end: true; reason: string }
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
