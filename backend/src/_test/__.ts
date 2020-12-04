import { domain } from '../lib/domain'
import { Api } from '../lib/domain/api/types'
import { Event } from '../lib/domain/event/types'
import { Flow } from '../lib/domain/types/path'

require('../../dotenv.js')

type TestD = {
  an: {
    api: Api<{ a: number }, { b: string }>
    del: Api<{ c: number }, { d: string }>
    ev: Event<{ a: number }>
  }
}

const TestD = domain<TestD>({ name: 'TestDomain' })
;(async () => {
  const flow: Flow = {
    _key: 'mykey',
    _route: 'mytag',
  }

  TestD.callApi({
    api: 'an.del',
    req: { c: 3 },
    opts: { delay: 2000, justEnqueue: true /* , noReply: true */ },
    flow: flow,
  }).then((_) => console.log('_TEST_THEN', _))

  TestD.bindApi({
    event: 'an.ev',
    api: 'an.api',
  })

  TestD.respondApi({
    api: 'an.api',
    async handler({ req: { a }, flow }) {
      console.log(`respond 'an.api' ${a}`, flow)
      return { b: `api was ${a}` }
    },
  })

  TestD.respondApi({
    api: 'an.del',
    async handler({ req: { c }, flow }) {
      console.log(`respond 'an.del' ${c}`, flow)
      TestD.emitEvent({ event: 'an.ev', flow, payload: { a: c + 100 } })
      return { d: `del was ${c}` }
    },
  })
})()
