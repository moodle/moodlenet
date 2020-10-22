import { DomainTransport } from '@mn-be/domainTransport/types'
import { DomainApiMap } from '../types'
import { EmailDomain, SendEmailReq } from './types'

export type Workers = {
  sendEmail(emailDesc: SendEmailReq): Promise<{ id: string } | { error: string }>
}
export type Cfg = {
  trnsp: DomainTransport<EmailDomain>
  workers: Workers
}

export const makeEmailDomain = ({ workers, trnsp }: Cfg): DomainApiMap<EmailDomain> => {
  const sendEmail: DomainApiMap<EmailDomain>['sendEmail'] = async (request) =>
    workers.sendEmail(request).then((response) => {
      trnsp.pub('sendEmail', { request, response })
      return response
    })

  return {
    sendEmail,
  }
}
