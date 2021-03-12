import { Config } from 'arangojs/connection'
import { DomainSetup, DomainStart } from '../../../../../lib/domain/types'
import { initMoodleNetGQLWrkService } from '../../../../MoodleNetGraphQL'
import { createEdgeWorker } from './apis/createEdge'
import { createNodeWorker } from './apis/createNode'
import { getNodeWorker } from './apis/getNode'
import { GlyphCreateCounterSubscriber } from './apis/glyphCreateCounters'
import { getContentGraphResolvers } from './graphql.resolvers'
import { MoodleNetArangoContentGraphSubDomain } from './MoodleNetArangoContentGraphSubDomain'
import { getPersistenceWTeardown } from './persistence'

export const defaultArangoContentGraphSetup: DomainSetup<MoodleNetArangoContentGraphSubDomain> = {
  'ContentGraph.Node.ById': { kind: 'wrk' },
  'ContentGraph.Edge.Create': { kind: 'wrk' },
  'ContentGraph.Node.Create': { kind: 'wrk' },
  'ContentGraph.GQL': { kind: 'wrk' },
  'ContentGraph.Counters.GlyphCreate': {
    kind: 'sub',
    events: ['ContentGraph.Edge.Created', 'ContentGraph.Node.Created'],
  },
  'ContentGraph.CreateNewRegisteredUser': { kind: 'wrk' },
  'ContentGraph.Edge.Traverse': { kind: 'wrk' },
  'ContentGraph.GetAccountUser': { kind: 'wrk' },
  'ContentGraph.GlobalSearch': { kind: 'wrk' },
}

export const defaultArangoContentGraphStartServices = ({ dbCfg }: { dbCfg: Config }) => {
  const _getPersistence = () => getPersistenceWTeardown({ cfg: dbCfg })
  const moodleNetArangoContentGraphSubDomainStart: DomainStart<MoodleNetArangoContentGraphSubDomain> = {
    'ContentGraph.Counters.GlyphCreate': {
      init: async () => {
        return [GlyphCreateCounterSubscriber, () => {}]
      },
    },
    'ContentGraph.Node.Create': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [createNodeWorker({ persistence }), teardown]
      },
    },
    'ContentGraph.Edge.Create': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [createEdgeWorker({ persistence }), teardown]
      },
    },
    'ContentGraph.Node.ById': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [getNodeWorker({ persistence }), teardown]
      },
    },
    'ContentGraph.GQL': {
      init: initMoodleNetGQLWrkService({
        srvName: 'ContentGraph',
        executableSchemaDef: { resolvers: getContentGraphResolvers() },
      }),
    },
  }
  return moodleNetArangoContentGraphSubDomainStart
}
