import * as A from '../lib/domain3/amqp'
import * as D from '../lib/domain3/domain'
import { persistence } from '../lib/domain3/domain.env'
import { MoodleNetDomain } from './MoodleNetDomain'
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
      // const verWfId = await A.publishWfStart({
      //   pointer: accVer('start'),
      //   payload: { email: payload.p.email },
      //   opts: {
      //     parentWf: info.id,
      //   },
      // })
      // const src = { id: verWfId, point: accVer('end')('*') }
      // const dest = { id: '*', point: accReg('signal')('EmailConfirmResult') }
      // // const { type: stype, parentType: sparentType, payload: spayload, keyName: skeyName } = src
      // // const { type: dtype, parentType: dparentType, payload: dpayload, keyName: dkeyName } = dest
      // await A.bindPointer({ dest, src })
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
      setTimeout(() => {
        Math.random() > 0.5
          ? A.publishWf({
              pointer: accVer('end')('Confirmed'),
              id: info.id,
              payload: {
                email: payload.p.email,
              },
            })
          : A.publishWf({
              pointer: accVer('end')('Expired'),
              id: info.id,
              payload: {
                x: payload.p.email,
              },
            })
      }, 2000)

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
