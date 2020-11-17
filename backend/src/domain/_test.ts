import { consumeWf, consumeWfStart, publishWf, publishWfStart } from '../lib/domain3/amqp'
import { point } from '../lib/domain3/domain'
import { newUuid } from '../lib/helpers/misc'
import { MoodleNetDomain } from './/MoodleNetDomain'
const l = (...args: any[]) =>
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
          WaitingConfirmEmail: 'WaitingConfirmEmail',
        },
      })
      return 'ack'
    },
  })

  await consumeWf({
    pointer: accReg('progress')('WaitingConfirmEmail'),
    id: '*',
    handler: ({ info, payload: payload }) => {
      l('consume Progress WF', info, payload)
      const rej = Math.random() > 0.5
      const { WaitingConfirmEmail } = payload.p
      rej
        ? publishWf({
            pointer: accReg('end')('Rejected'),
            id: info.id,
            payload: { reason: ` because  ${WaitingConfirmEmail}` },
          })
        : publishWf({
            pointer: accReg('end')('AccountActivated'),
            id: info.id,
            payload: { AccountActivated: 'AccountActivated' },
          })
      return 'ack'
    },
  })
  l('**')

  for (let i = 0; i < 100; i++) {
    const id = newUuid()
    l(id)
    const x = await consumeWf({
      pointer: accReg('end')('*'),
      id: '*',
      handler: ({ info, payload }) => {
        l(
          `*** *********************************************************************RESP ${i}zz`,
          info,
          payload
        )
        // x.then((_) => _())
        return 'ack'
      },
    })
    publishWfStart({
      pointer: accReg('start'),
      payload: {
        email: `${i}zz`,
        username: 'ww',
      },
    })
  }
})()
