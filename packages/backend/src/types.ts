import dot from 'dot'

export type EmailAddr = string

export type EmailObj = {
  to: EmailAddr
  from: EmailAddr
  subject: string
  text?: string
  html?: string
}

export type EmailTemplate<Vars> = Pick<EmailObj, 'from' | 'subject' | 'html' | 'text'> & {
  $fake?: Vars
}
export const fillEmailTemplate = <Vars>(_: {
  template: EmailTemplate<Vars>
  to: string
  vars: Vars
  type?: 'text' | 'html'
}): EmailObj => {
  const { template, to, vars, type = 'html' } = _
  const tplString = template[type]
  const msg = { [type]: tplString && dot.compile(tplString)(vars) }
  return {
    ...template,
    ...msg,
    to,
  }
}

export type PasswordVerifier = (_: { pwdhash: string; pwd: string }) => Promise<boolean>
