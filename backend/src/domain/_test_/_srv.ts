import * as A from '../../lib/domain/amqp'
import * as D from '../../lib/domain/domain'
import { persistence } from '../../lib/domain/domain.env'
import { MoodleNetDomain } from '../MoodleNetDomain'
const __LOG = true
const l = (...args: any[]) =>
  __LOG &&
  console.log('SRV ----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')

const acc = D.point<MoodleNetDomain>('MoodleNet')('srv')('Accounting')
const accReg = acc('wf')('RegisterNewAccount')
const accVer = acc('wf')('VerifyAccountEmail')
;(async () => {
  await A.consumeWfStart({
    pointer: accReg('start'),
    handler: async ({ info, payload }) => {
      l('RegisterNewAccount start', info, payload)

      A.spawnWf({
        spawnPointer: accVer('start'),
        payload: { email: payload.p.email },
        // endPointer: accVer('end')('*'),
        sigPointer: accReg('signal')('EmailConfirmResult'),
        parentWf: info.id,
      })

      await A.publishWf({
        pointer: accReg('progress')('WaitingConfirmEmail'),
        id: info.id,
        payload: {
          email: payload.p.email,
        },
      })
      return 'ack' as const
    },
  })
  const g = accVer('end')('*')
  g.parentType
  await A.consumeWfStart({
    pointer: accVer('start'),
    handler: async ({ info, payload }) => {
      l('Verify email start', info, payload)
      A.publishWf({
        pointer: accVer('end')('Expired'),
        id: info.id,
        payload: {
          x: `delayed exp ${payload.p.email}`,
        },
        opts: { delay: 2000 },
      })
      // A.publishWf({
      //   pointer: accVer('end')('Confirmed'),
      //   id: info.id,
      //   payload: {
      //     email: payload.p.email,
      //   },
      // })

      return 'ack' as const
    },
  })

  await A.consumeWf({
    pointer: accReg('signal')('EmailConfirmResult'),
    id: '*',
    handler: async ({ info, payload }) => {
      l('consume signal EmailConfirmResult', info, payload)
      const { parentWf: accRegWfId } = (await persistence.getWFState(info)) || {}
      if (!accRegWfId) {
        return 'reject'
      }
      payload.p.t !== 'Confirmed'
        ? A.publishWf({
            pointer: accReg('end')('Rejected'),
            id: accRegWfId,
            payload: {
              reason: ` because  ${payload.p.t == 'Aborted' ? payload.p.p.reason : payload.p.p.x}`,
            },
          })
        : A.publishWf({
            pointer: accReg('end')('AccountActivated'),
            id: accRegWfId,
            payload: { AccountActivated: payload.p.p.email },
          })
      return 'ack'
    },
  })
  l('**')
})()
