import { point } from './domain'
import { consume, publish, consumeWf, publishWf, publishWfStart } from './amqp'
import { MoodleNetDomain } from '../../domain/MoodleNetDomain'
import { newUuid } from '../helpers/misc'
const l = (...args: any[]) =>
  console.log('APP----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')

const accReg = point<MoodleNetDomain>('MoodleNet')('srv')('Accounting')('wf')('RegisterNewAccount')

;(async () => {
  await consumeWf(accReg('start'), '*', (msg) => {
    l('consume Start WF', msg)
    publishWf(accReg('progress')('WaitingConfirmEmail'), 'xx', {
      WaitingConfirmEmail: 'WaitingConfirmEmail',
    })
    return 'ack'
  })

  await consumeWf(accReg('progress')('WaitingConfirmEmail'), '*', (__) => {
    l('consume Progress WF', __)
    const rej = Math.random() > 0.5
    const { WaitingConfirmEmail } = __.p
    rej
      ? publishWf(accReg('end')('Rejected'), 'ID', { reason: ` because  ${WaitingConfirmEmail}` })
      : publishWf(accReg('end')('AccountActivated'), 'ID', { AccountActivated: 'AccountActivated' })
    return 'ack'
  })

  for (let i = 0; i < 1; i++) {
    const id = newUuid()
    const x = consumeWf(accReg('end')('*'), '*', (end) => {
      end.t === 'Rejected' && end.p.reason
      l(`*** *********************************************************************RESP ${i}zz`, {
        _: end,
        id /*  state: await _.state() */,
      })
      // x.then((_) => _())
      return 'ack'
    })
    publishWfStart(accReg('start'), {
      email: `${i}zz`,
      username: 'ww',
    })
  }
})()
