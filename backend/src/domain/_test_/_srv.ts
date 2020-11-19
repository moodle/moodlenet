import * as A from '../../lib/domain/amqp'
import * as D from '../../lib/domain/domain'
import { persistence } from '../../lib/domain/domain.env'
import { MoodleNetDomain } from '../MoodleNetDomain'
const __LOG = true
const l = (...args: any[]) =>
  __LOG &&
  console.log('SRV ----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')

const acc = D.point<MoodleNetDomain>('MoodleNet')('srv')('Accounting')
const mail = D.point<MoodleNetDomain>('MoodleNet')('srv')('Email')
const accReg = acc('wf')('RegisterNewAccount')
const mailVer = mail('wf')('VerifyEmail')
;(async () => {
  await A.consumeWfStart({
    pointer: accReg('start'),
    handler: async ({ info, payload }) => {
      l('RegisterNewAccount start', info, payload)

      A.spawnWf({
        spawnPointer: mailVer('start'),
        payload: { email: { to: payload.p.email }, maxAttempts: 2, tokenReplaceRegEx: '' },
        // endPointer: accVer('end')('*'),
        sigPointer: accReg('signal')('EmailConfirmationResult'),
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

  await A.consumeWfStart({
    pointer: mailVer('start'),
    handler: async ({ info, payload }) => {
      l('Verify email start', info, payload)
      A.publishWf({
        pointer: mailVer('progress')('WaitingConfirmation'),
        id: info.id,
        payload: { attemptCount: 1 },
      })
      return 'ack' as const
    },
  })
  await A.consumeWf({
    pointer: mail('wf')('VerifyEmail')('signal')('ConfirmEmail'),
    id: '*',
    handler: async ({ info, payload }) => {
      l('consume signal ConfirmEmail', info, payload)
      const state = await persistence.getWFState<MoodleNetDomain, 'Email', 'VerifyEmail'>(info)
      if (state?.status === 'progress' && state.progress.p.token === payload.p.token) {
        A.publishWf({
          pointer: mailVer('end')('Confirmed'),
          id: info.id,
          payload: {},
        })
      }
      return 'ack' as const
    },
  })

  await A.consumeWf({
    pointer: accReg('signal')('EmailConfirmationResult'),
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
              reason: `unconfirmed email`,
            },
          })
        : A.publishWf({
            pointer: accReg('end')('NewAccountActivated'),
            id: accRegWfId,
            payload: {},
          })
      return 'ack'
    },
  })
})()
