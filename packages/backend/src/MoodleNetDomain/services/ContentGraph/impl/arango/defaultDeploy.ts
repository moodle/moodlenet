import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { Config } from 'arangojs/connection'
import { DomainSetup, DomainStart } from '../../../../../lib/domain/types'
import { getSystemExecutionContext, initMoodleNetGQLWrkService } from '../../../../MoodleNetGraphQL'
import { createEdgeWorker } from './apis/createEdge'
import { createNodeWorker } from './apis/createNode'
import { deleteEdgeWorker } from './apis/deleteEdge'
import { getNodeWorker } from './apis/getNode'
import { globalSearchWorker } from './apis/globalSearch'
import { statsMaintainEdgeCountersOnCreate, statsMaintainEdgeCountersOnDelete } from './apis/maintainEdgeCounters'
import { traverseEdgesWorker } from './apis/traverseEdges'
import { createNode } from './functions/createNode'
import { getNode } from './functions/getNode'
import { getContentGraphResolvers } from './graphql.resolvers'
import { MoodleNetArangoContentGraphSubDomain } from './MoodleNetArangoContentGraphSubDomain'
import { getPersistence } from './persistence'

export const defaultArangoContentGraphSetup: DomainSetup<MoodleNetArangoContentGraphSubDomain> = {
  'ContentGraph.Node.ById': { kind: 'wrk' },
  'ContentGraph.Edge.Create': { kind: 'wrk' },
  'ContentGraph.Edge.Delete': { kind: 'wrk' },
  'ContentGraph.Node.Create': { kind: 'wrk' },
  'ContentGraph.GQL': { kind: 'wrk' },
  'ContentGraph.Stats.MaintainEdgeCounters.Created': {
    kind: 'sub',
    event: 'ContentGraph.Edge.Created',
  },
  'ContentGraph.Stats.MaintainEdgeCounters.Deleted': {
    kind: 'sub',
    event: 'ContentGraph.Edge.Deleted',
  },
  'ContentGraph.CreateProfileForNewUser': { kind: 'wrk' },
  'ContentGraph.Edge.Traverse': { kind: 'wrk' },
  'ContentGraph.GetUserProfile': { kind: 'wrk' },
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
    'ContentGraph.Stats.MaintainEdgeCounters.Created': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [statsMaintainEdgeCountersOnCreate({ persistence }), teardown]
      },
    },
    'ContentGraph.Stats.MaintainEdgeCounters.Deleted': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [statsMaintainEdgeCountersOnDelete({ persistence }), teardown]
      },
    },
    'ContentGraph.Edge.Create': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [createEdgeWorker({ persistence }), teardown]
      },
    },
    'ContentGraph.Node.Create': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [createNodeWorker({ persistence }), teardown]
      },
    },
    'ContentGraph.Edge.Delete': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [deleteEdgeWorker({ persistence }), teardown]
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
    'ContentGraph.CreateProfileForNewUser': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [
          async ({ username, key }) => {
            const createResult = await createNode({
              data: { name: username, summary: '' },
              nodeType: 'Profile',
              persistence,
              key,
              ctx: getSystemExecutionContext({}),
            })
            if (typeof createResult === 'string') {
              throw new Error(createResult)
            }
            if ('CreateNodeAssertionsFailed' in createResult) {
              throw new Error('CreateNodeAssertionsFailed')
            }

            return createResult
          },
          teardown,
        ]
      },
    },
    'ContentGraph.GetUserProfile': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [
          async ({ profileId }) => {
            const { _key, nodeType } = parseNodeId(profileId)

            if (nodeType !== 'Profile') {
              return null
            }
            return getNode<'Profile'>({ _key, nodeType: 'Profile', persistence, ctx: getSystemExecutionContext({}) })
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
