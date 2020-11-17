import { consumeWf, consumeWfStart, publishWf } from '../lib/domain3/amqp'
import { point } from '../lib/domain3/domain'
import { MoodleNetDomain } from './MoodleNetDomain'
const __LOG = false
const l = (...args: any[]) =>
  __LOG &&
  console.log('APP----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')

const acc = point<MoodleNetDomain>('MoodleNet')('srv')('Accounting')
const accReg = acc('wf')('RegisterNewAccount')
const g = acc('ev')('*')
;(async () => {
  await consumeWfStart({
    pointer: accReg('start'),
    id: '*',
    handler: ({ info, payload }) => {
      l('consume Start WF', info, payload)
      publishWf({
        pointer: accReg('progress')('WaitingConfirmEmail'),
        id: info.id,
        payload: {
          email: payload.p.email,
          WaitingConfirmEmail: 'WaitingConfirmEmail',
        },
      })
      return 'ack'
    },
  })

  await consumeWf({
    pointer: accReg('progress')('WaitingConfirmEmail'),
    id: '*',
    handler: ({ info, payload }) => {
      l('consume Progress WF', info, payload)
      const rej = Math.random() > 0.5
      const { WaitingConfirmEmail } = payload.p
      rej
        ? publishWf({
            pointer: accReg('end')('Rejected'),
            id: info.id,
            payload: { email: payload.p.email, reason: ` because  ${WaitingConfirmEmail}` },
          })
        : publishWf({
            pointer: accReg('end')('AccountActivated'),
            id: info.id,
            payload: { email: payload.p.email, AccountActivated: 'AccountActivated' },
          })
      return 'ack'
    },
  })
  l('**')
})()
