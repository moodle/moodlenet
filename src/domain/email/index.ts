import { DomainTransport } from '@mn-be/domainTransport/DomainTransportTypes'
import { DomainApiMap } from '../DomainTypes'
import { EmailDomain, SendEmailOutcome, SendEmailReq } from './EmailDomainTypes'

export type Workers = {
  sendEmail(emailDesc: SendEmailReq): Promise<SendEmailOutcome>
}
export type Cfg = {
  trnsp: DomainTransport<EmailDomain>
  workers: Workers
}

export const makeEmailDomain = ({ workers, trnsp }: Cfg): DomainApiMap<EmailDomain> => {
  const sendEmail: DomainApiMap<EmailDomain>['sendEmail'] = (req) =>
    workers.sendEmail(req).then((res) => {
      trnsp.pub({ type: 'sendEmail', payload: { req: req, res: res } })
      return res
    })

  return {
    sendEmail,
  }
}
