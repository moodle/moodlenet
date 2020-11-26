import { domain } from '../lib/domain'
import { Api } from '../lib/domain/api/types'
import { Event } from '../lib/domain/event/types'
import { FlowId } from '../lib/domain/types/path'

require('../../dotenv.js')

type TestD = {
  an: {
    api: Api<{ a: number }, { b: string }>
    del: Api<{ c: number }, { d: string }>
    ev: Event<{ a: number }>
  }
}

const TestD = domain<TestD>('TestDomain')
;(async () => {
  const flowId: FlowId = {
    _key: 'mykey',
    _tag: 'mytag',
  }

  TestD.api
    .call({
      api: 'an.del',
      req: { c: 3 },
      opts: { delay: 2000 /* , noReply: true */ },
      flowId,
    })
    .then((_) => console.log('_TEST_THEN', _))

  TestD.event.bindToApi({
    event: 'an.ev',
    api: 'an.api',
    tag: flowId._tag,
  })

  TestD.api.respond({
    api: 'an.api',
    async handler({ req: { a }, flowId }) {
      console.log(`respond 'an.api' ${a}`, flowId)
      return { b: `api was ${a}` }
    },
  })

  TestD.api.respond({
    api: 'an.del',
    async handler({ req: { c }, flowId }) {
      console.log(`respond 'an.del' ${c}`, flowId)
      TestD.event.emit({ event: 'an.ev', flowId, payload: { a: c + 100 } })
      return { d: `del was ${c}` }
    },
  })
})()
