import { d } from '../lib/domain2/domain'
import { newUuid } from '../lib/helpers/misc'
import { MoodleNetDomain } from './MoodleNetDomain'
const l = (...args: any[]) =>
  console.log('APP----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')

const accReg = d<MoodleNetDomain>('MoodleNet')('Accounting').wf('RegisterNewAccount')

;(async () => {
  await accReg.start().consume({
    handler: (_) => {
      const { params, id } = _
      // l('consume Start WF', _)
      accReg
        .progress('WaitingConfirmEmail')
        .publish({ id, progress: { WaitingConfirmEmail: 'WaitingConfirmEmail' } })
      return 'ack'
    },
  })

  await accReg.progress('WaitingConfirmEmail').consume({
    handler: (_) => {
      const {
        id,
        progress: { payload, type },
      } = _
      // l('consume Progress WF', _)
      const rej = Math.random() > 0.5
      rej
        ? accReg.end('Rejected').publish({ id, payload: { reason: ` because ${type} ${payload}` } })
        : accReg
            .end('AccountActivated')
            .publish({ id, payload: { AccountActivated: 'AccountActivated' } })
      return 'ack'
    },
    id: '*',
  })
  for (let i = 0; i < 1000; i++) {
    const id = newUuid()
    const x = await accReg.end('*').consume({
      id,
      handler: ({ end, id }) => {
        l(`*** *********************************************************************RESP ${i}zz`, {
          end,
          id /*  state: await _.state() */,
        })
        // x.then((_) => _())
        x()
        return 'ack'
      },
    })
    accReg.start().publish({
      params: {
        email: `${i}zz`,
        username: 'ww',
      },
      id,
    })
  }
})()
