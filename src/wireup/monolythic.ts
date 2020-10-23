import { makeEmailDomain } from '@mn-be/domain/email'
// import { makeWorkers } from '@mn-be/domain/email/mock'
import { makeWorkers } from '@mn-be/domain/email/mailgun'
import { EmailDomain } from '@mn-be/domain/email/EmailDomainTypes'
import { domainTransport, inProcess } from '@mn-be/domainTransport'
import { bindApis } from '@mn-be/domainTransport/inProcess'

const messageTransport = inProcess.make({}, { logger: console.log })

const emailDomainWorkers = makeWorkers({ mailgunCfg: { apiKey: '', domain: '' } }, {})
const emailDomainTransport = domainTransport({ domain: 'Email', msgT: messageTransport })
const emailDomain = makeEmailDomain({
  workers: emailDomainWorkers,
  trnsp: emailDomainTransport,
})
bindApis<EmailDomain>('Email', emailDomain, messageTransport)

//@ts-ignore
global.T = messageTransport
