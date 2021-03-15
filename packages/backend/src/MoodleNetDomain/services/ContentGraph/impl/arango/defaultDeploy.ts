import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { Config } from 'arangojs/connection'
import { DomainSetup, DomainStart } from '../../../../../lib/domain/types'
import { initMoodleNetGQLWrkService, SYSTEM_USER_ID } from '../../../../MoodleNetGraphQL'
import { NodeType } from '../../ContentGraph.graphql.gen'
import { createEdgeWorker } from './apis/createEdge'
import { createNodeWorker } from './apis/createNode'
import { getNodeWorker } from './apis/getNode'
import { globalSearchWorker } from './apis/globalSearch'
import { statsMaintainEdgeCounters } from './apis/maintainEdgeCounters'
import { traverseEdgesWorker } from './apis/traverseEdges'
import { createNode } from './functions/createNode'
import { getNode } from './functions/getNode'
import { getContentGraphResolvers } from './graphql.resolvers'
import { MoodleNetArangoContentGraphSubDomain } from './MoodleNetArangoContentGraphSubDomain'
import { getPersistence } from './persistence'

export const defaultArangoContentGraphSetup: DomainSetup<MoodleNetArangoContentGraphSubDomain> = {
  'ContentGraph.Node.ById': { kind: 'wrk' },
  'ContentGraph.Edge.Create': { kind: 'wrk' },
  'ContentGraph.Node.Create': { kind: 'wrk' },
  'ContentGraph.GQL': { kind: 'wrk' },
  'ContentGraph.Stats.MaintainEdgeCounters': {
    kind: 'sub',
    event: 'ContentGraph.Edge.Created',
  },
  'ContentGraph.CreateNewRegisteredUser': { kind: 'wrk' },
  'ContentGraph.Edge.Traverse': { kind: 'wrk' },
  'ContentGraph.GetAccountUser': { kind: 'wrk' },
  'ContentGraph.GlobalSearch': { kind: 'wrk', cfg: { parallelism: 50 } },
}

export const defaultArangoContentGraphStartServices = ({
  dbCfg,
  databaseName,
}: {
  dbCfg: Config
  databaseName: string
}) => {
  const _getPersistence = () => getPersistence({ cfg: dbCfg, databaseName })
  const moodleNetArangoContentGraphSubDomainStart: DomainStart<MoodleNetArangoContentGraphSubDomain> = {
    'ContentGraph.Stats.MaintainEdgeCounters': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [statsMaintainEdgeCounters({ persistence }), teardown]
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
          ({ username, key }) =>
            createNode({
              data: { name: username, summary: '' },
              nodeType: NodeType.User,
              persistence,
              key,
              creatorId: SYSTEM_USER_ID,
            }),
          teardown,
        ]
      },
    },
    'ContentGraph.GetAccountUser': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [
          async ({ userId }) => {
            const { _key, nodeType } = parseNodeId(userId)
            if (nodeType !== NodeType.User) {
              return null
            }
            return getNode<NodeType.User>({ _key, nodeType: NodeType.User, persistence })
          },
          teardown,
        ]
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
