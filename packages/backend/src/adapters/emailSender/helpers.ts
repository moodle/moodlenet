import dot from 'dot'
import { EmailObj, EmailTemplate } from './types'

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
