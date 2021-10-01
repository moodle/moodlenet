import dot from 'dot'
import { EmailObj, EmailTemplate } from './types'

export const fillEmailTemplate = <Vars>(_: {
  template: EmailTemplate<Vars>
  to: string
  vars: Vars
  type?: 'text' | 'html'
}): EmailObj => {
  const { template, to, vars, type = 'html' } = _
  const tplString = template[type]
  const interpolated: Pick<EmailObj, 'subject' | 'html' | 'text'> = {
    [type]: tplString && dot.compile(tplString)(vars),
    subject: dot.compile(template.subject)(vars),
  }
  return {
    ...template,
    ...interpolated,
    to,
  }
}
