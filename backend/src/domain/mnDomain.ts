import { make } from '../lib/domain/domain'
import { MoodleDomain } from './types'

const mnDomain = make<MoodleDomain>('MoodleDomain')

mnDomain.enqueue('Accounting', 'RegisterNewAccount', { email: '', username: '' })
mnDomain.bindWF('Accounting', 'RegisterNewAccount', '*', 'progress', 'WaitingConfirmEmail', (p) => {
  p.x
})
mnDomain.bindEV('Accounting', 'YY', (p) => {
  p.b
})
mnDomain.consumeWF('Accounting', 'RegisterNewAccount', (p, m) => {
  p.email
  m.wfid
})
