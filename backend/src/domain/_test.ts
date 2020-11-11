import { mnDomain } from './mnDomain'
const l = (...args: any[]) =>
  console.log('----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n')
;(async () => {
  await mnDomain.consumeWF(
    'Accounting',
    'RegisterNewAccount',
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
    'Accounting',
    'RegisterNewAccount',
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

  mnDomain
    .callSync('Accounting', 'RegisterNewAccount', { email: 'yyy', username: 'ww' })
    .then((_) => l('yyy call then', _), console.error)
  mnDomain

    .callSync('Accounting', 'RegisterNewAccount', { email: 'zz', username: 'ww' })
    .then((_) => l('zz call then', _), console.error)
})()
