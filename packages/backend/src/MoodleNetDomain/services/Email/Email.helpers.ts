import dot from 'dot'
import { EmailObj } from './types'

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
