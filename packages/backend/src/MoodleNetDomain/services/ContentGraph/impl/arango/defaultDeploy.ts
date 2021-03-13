import { Config } from 'arangojs/connection'
import { DomainSetup, DomainStart } from '../../../../../lib/domain/types'
import { initMoodleNetGQLWrkService } from '../../../../MoodleNetGraphQL'
import { NodeType } from '../../ContentGraph.graphql.gen'
import { createEdgeWorker } from './apis/createEdge'
import { createNodeWorker } from './apis/createNode'
import { getNodeWorker } from './apis/getNode'
import { globalSearchWorker } from './apis/globalSearch'
import { GlyphCreateCounterSubscriber } from './apis/glyphCreateCounters'
import { traverseEdgesWorker } from './apis/traverseEdges'
import { createNode } from './functions/createNode'
import { getNode } from './functions/getNode'
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
    event: 'ContentGraph.Edge.Created',
  },
  'ContentGraph.CreateNewRegisteredUser': { kind: 'wrk' },
  'ContentGraph.Edge.Traverse': { kind: 'wrk' },
  'ContentGraph.GetAccountUser': { kind: 'wrk' },
  'ContentGraph.GlobalSearch': { kind: 'wrk', cfg: { parallelism: 50 } },
}

export const defaultArangoContentGraphStartServices = ({ dbCfg }: { dbCfg: Config }) => {
  const _getPersistence = () => getPersistenceWTeardown({ cfg: dbCfg })
  const moodleNetArangoContentGraphSubDomainStart: DomainStart<MoodleNetArangoContentGraphSubDomain> = {
    'ContentGraph.Counters.GlyphCreate': {
      init: async () => {
        return [GlyphCreateCounterSubscriber]
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
    'ContentGraph.Edge.Traverse': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [traverseEdgesWorker({ persistence }), teardown]
      },
    },
    'ContentGraph.CreateNewRegisteredUser': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [
          ({ username }) =>
            createNode({
              data: { name: username, summary: '' },
              nodeType: NodeType.User,
              persistence,
            }),
          teardown,
        ]
      },
    },
    'ContentGraph.GetAccountUser': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [({ userId }) => getNode<NodeType.User>({ _id: userId, nodeType: NodeType.User, persistence }), teardown]
      },
    },
    'ContentGraph.GlobalSearch': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [globalSearchWorker({ persistence }), teardown]
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
