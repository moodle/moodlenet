export interface EmailSender {
  sendEmail: (_: EmailObj) => Promise<{ success: true; emailId: string } | { success: false; error: string }>
}
export type EmailAddr = string

export type EmailObj = {
  to: EmailAddr
  from: EmailAddr
  subject: string
  text?: string
  html?: string
}

// TODO:
// we need just EmailObj<Vars>
// and templateFillIn maps EmailObj props against Vars
export type EmailTemplate<Vars> = Pick<EmailObj, 'from' | 'subject' | 'html' | 'text'> & {
  $fake?: Vars
}
