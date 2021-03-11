import { StartServices } from '../lib/domain/amqp/start'
import { DomainSetup } from '../lib/domain/types'
import { MoodleNetDomain } from './MoodleNetDomain'
import { initMoodleNetGQLWrkService } from './MoodleNetGraphQL'
import { createEdge } from './services/ContentGraph/impl/arango/apis/createEdge'
import { createNode } from './services/ContentGraph/impl/arango/apis/createNode'
import { getNode } from './services/ContentGraph/impl/arango/apis/getNode'
import { glyphCreateCounter } from './services/ContentGraph/impl/arango/apis/glyphCreateCounters'
import { getContentGraphResolvers } from './services/ContentGraph/impl/arango/graphql.resolvers'
import {
  defaulArangoMailgunImpl,
  defaultArangoMailgunImplStartServices,
} from './services/Email/impl/arango/defaultDeploy'
import {
  defaultArangoUserAccountImpl,
  defaultArangoUserAccountStartServices,
} from './services/UserAccount/impl/arango/defaultDeploy'
import {} from './services/UserAccount/impl/arango/graphql-resolvers'

export const defaultMoodlenetImpl: DomainSetup<MoodleNetDomain> = {
  'ContentGraph.Counters.GlyphCreate': {
    events: ['ContentGraph.Edge.Created', 'ContentGraph.Node.Created'],
    kind: 'sub',
    init: glyphCreateCounter,
  },
  'ContentGraph.Edge.Create': {
    kind: 'wrk',
    init: createEdge,
  },
  'ContentGraph.Node.Create': {
    kind: 'wrk',
    init: createNode,
  },
  'ContentGraph.Node.ById': {
    kind: 'wrk',
    init: getNode,
  },

  'ContentGraph.GQL': initMoodleNetGQLWrkService({
    srvName: 'ContentGraph',
    executableSchemaDef: { resolvers: getContentGraphResolvers() },
  }),
  ...defaulArangoMailgunImpl,
  ...defaultArangoUserAccountImpl,
}

export const defaultMoodlenetStartServices: StartServices<MoodleNetDomain> = {
  'ContentGraph.Counters.GlyphCreate': {},
  'ContentGraph.Edge.Create': {},
  'ContentGraph.GQL': {},
  'ContentGraph.Node.ById': {},
  'ContentGraph.Node.Create': {},
  ...defaultArangoMailgunImplStartServices,
  ...defaultArangoUserAccountStartServices,
}
