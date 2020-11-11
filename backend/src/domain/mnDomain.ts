import { make } from '../lib/domain/domain'
import { mockWFPersistence } from '../lib/domain/persistence/mock'
import { MoodleDomain } from './types'

export const mnDomain = make<MoodleDomain>('MoodleDomain', mockWFPersistence)

// mnDomain.enqueue('Accounting', 'RegisterNewAccount', { email: '', username: '' })
// mnDomain.bindWFProgress('Accounting', 'RegisterNewAccount', '*', (p, c, progress, end, meta) => {
//   p._type === 'WaitingConfirmEmail' && p.WaitingConfirmEmail
//   c.ctx
// })
// mnDomain.bindWFEnd('Accounting', 'RegisterNewAccount', '*', (p, c) => {
//   p._type === 'AccountActivated' && p.AccountActivated
//   c.ctx
// })
// mnDomain.bindWF('Accounting', 'RegisterNewAccount', '*', (p, c) => {
//   p._type === 'AccountActivated' && p.AccountActivated
//   p._type === 'Rejected' && p.reason
//   p._type === 'aWaitingConfirmEmail' && p.aWaitingConfirmEmail
//   c.ctx
// })
// mnDomain.bindEV('Accounting', 'XX', (p) => {
//   p.a
// })
// mnDomain.consumeWF('Accounting', 'VerifyAccountEmail', (p, progress, end, m) => {
//   p.email
//   m.wfid
//   progress(
//     { _type: 'EmailSent', EmailSent: 'EmailSent' },
//     { attemptCount: 0, email: p.email, token: '' }
//   )
//   end(
//     { _type: 'Confirmed', Confirmed: 'Confirmed' },
//     { attemptCount: 0, email: p.email, token: '' }
//   )
// })
// mnDomain.end('Accounting', 'RegisterNewAccount', '', { _type: 'Rejected', reason: '' }, {})
// mnDomain.progress(
//   'Accounting',
//   'RegisterNewAccount',
//   '',
//   { _type: 'WaitingConfirmEmail', WaitingConfirmEmail: 'WaitingConfirmEmail' },
//   {}
// )
// mnDomain.callSync('Accounting', 'RegisterNewAccount', { email: '', username: '' }).then((_) => {
//   _.endPayload._type === 'Rejected' && _.endPayload.reason
// })
