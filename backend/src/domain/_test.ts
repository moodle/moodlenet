import { consumeWf, publishWf, publishWfStart } from '../lib/domain3/amqp'
import { point } from '../lib/domain3/domain'
import { newUuid } from '../lib/helpers/misc'
import { MoodleNetDomain } from './/MoodleNetDomain'
const l = (...args: any[]) =>
  console.log('APP----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')

const acc = point<MoodleNetDomain>('MoodleNet')('srv')('Accounting')
const accReg = acc('wf')('RegisterNewAccount')
const g = acc('ev')('*')

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

  for (let i = 0; i < 100; i++) {
    const id = newUuid()
    const x = await consumeWf(accReg('end')('*'), '*', (end) => {
      l(`*** *********************************************************************RESP ${i}zz`, {
        _: end.t === 'Rejected' ? end.p.reason : end.p.AccountActivated,
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
