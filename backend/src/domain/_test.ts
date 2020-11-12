import { domain } from '../lib/domain/domain';
import { MoodleNetDomain } from './MoodleNetDomain';
const l = (...args: any[]) =>
  console.log('APP----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')
  ; (async () => {
    const mnDomain = domain<MoodleNetDomain>('MoodleNet')
    await mnDomain.consumeWF({
      wf: 'Accounting.RegisterNewAccount',
      consumer: ({ doProgress, startParams }) => {
        l('consumeWF', { startParams })
        const { email, username } = startParams
        doProgress({
          progress: { _type: 'aWaitingConfirmEmail', aWaitingConfirmEmail: 'aWaitingConfirmEmail' },
          ctx: { ctx: 'doing', email, username }
        })
      },
      opts: {
        qname: true,
      }
    })
    mnDomain.bindWFProgress
    await mnDomain.bindWFProgress({
      wf: 'Accounting.RegisterNewAccount',
      handler: async ({ doEnd, doProgress, meta, progress, state }) => {
        const _state = await state()
        l('bindWFProgress', { progress, _state })
        const act = Math.random() > 0.5
        doEnd({
          endProgress: act
            ? { _type: 'AccountActivated', AccountActivated: 'AccountActivated' }
            : { _type: 'Rejected', reason: 'because' },
          ctx: { ..._state.ctx, ctx: act ? 'act' : 'rej' }

        })
      },
      id: '*',
      opts: { queue: { durable: true }, qname: 'progress1' }
    })


    for (let i = 0; i < 1000; i++) {
      mnDomain
        .callSync({
          wf: 'Accounting.RegisterNewAccount',
          startParams: {
            email: `${i}zz`,
            username: 'ww',
          }
        })
        .then(async (_) => l(`*** RESP ${i}zz`, { ..._, state: await _.state() }), console.error)
    }
    console.error('done')
    // mnDomain.bindWF({ wf: 'Email.SendOne', handler, id, opts })
    // mnDomain.bindWFEnd({ wf: 'Accounting.RegisterNewAccount', handler, id, opts })
    // mnDomain.consumeWF({ wf: 'Email.SendOne', consumer, opts })
  })()
