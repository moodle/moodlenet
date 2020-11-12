import { domain } from '../lib/domain/domain';
import { MoodleNetDomain } from './MoodleNetDomain';
const l = (...args: any[]) =>
  console.log('APP----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')
  ; (async () => {
    const mnDomain = domain<MoodleNetDomain>('MoodleNetDomain')
    await mnDomain.consumeWF(
      'Accounting.RegisterNewAccount',
      (params, progress, end, meta) => {
        l('consumeWF', { params })
        const { email, username } = params
        progress(
          { _type: 'WaitingConfirmEmail', WaitingConfirmEmail: 'WaitingConfirmEmail' },
          { ctx: 'doing', email, username }
        )
      },
      {
        qname: true,
      }
    )
    await mnDomain.bindWFProgress(
      'Accounting.RegisterNewAccount',
      '*',
      (payload, ctx, progress, end, meta) => {
        l('bindWFProgress', { payload, ctx })
        const act = Math.random() > 0.5
        end(
          act
            ? { _type: 'AccountActivated', AccountActivated: 'AccountActivated' }
            : { _type: 'Rejected', reason: 'because' },
          { ...ctx, ctx: act ? 'act' : 'rej' }
        )
      },
      { queue: { durable: true }, qname: 'progress1' }
    )

    for (let i = 0; i < 10; i++) {
      mnDomain
        .callSync('Accounting.RegisterNewAccount', {
          email: `${i}zz`,
          username: 'ww',
        })
        .then((_) => l(`*** RESP ${i}zz`, _), console.error)
    }
    console.error('done')

  })()
