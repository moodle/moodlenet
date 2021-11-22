import dot from 'dot'
import { EmailObj } from '../../ports/system/sendEmail'

export const fillEmailTemplate = <Vars>(_: { template: EmailTemplate<Vars>; to: string; vars: Vars }): EmailObj => {
  const { template, to, vars } = _
  const interpolated: Pick<EmailObj, 'subject' | 'html' | 'text'> = {
    html: dot.compile(template.html ?? '')(vars),
    text: dot.compile(template.text ?? '')(vars),
    subject: dot.compile(template.subject)(vars),
  }
  return {
    ...template,
    ...interpolated,
    to,
  }
}
// TODO:
// we need just EmailObj<Vars>
// and templateFillIn maps EmailObj props against Vars
declare const EMAIL_TPL_SYM: unique symbol
export type EmailTemplate<Vars> = Pick<EmailObj, 'from' | 'subject' | 'html' | 'text'> & {
  [EMAIL_TPL_SYM]?: Vars
}
