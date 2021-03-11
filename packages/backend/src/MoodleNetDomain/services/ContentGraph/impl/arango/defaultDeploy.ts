import { Config } from 'arangojs/connection'
import { DomainSetup, DomainStart } from '../../../../../lib/domain/types'
import { initMoodleNetGQLWrkService } from '../../../../MoodleNetGraphQL'
import { getContentGraphResolvers } from './graphql.resolvers'
import { MoodleNetArangoContentGraphSubDomain } from './MoodleNetArangoContentGraphSubDomain'
import { getPersistence } from './persistence'

export const defaultArangoContentGraphSetup: DomainSetup<MoodleNetArangoContentGraphSubDomain> = {
  'ContentGraph.Node.ById': { kind: 'wrk' },
  'ContentGraph.Edge.Create': { kind: 'wrk' },
  'ContentGraph.Node.Create': { kind: 'wrk' },
  'ContentGraph.GQL': { kind: 'wrk' },
  'ContentGraph.Counters.GlyphCreate': {
    kind: 'sub',
    events: ['ContentGraph.Edge.Created', 'ContentGraph.Node.Created'],
  },
}

export const defaultArangoContentGraphStartServices = ({ dbCfg }: { dbCfg: Config }) => {
  const _getPersistence = () => getPersistence({ cfg: dbCfg })
  const moodleNetArangoContentGraphSubDomainStart: DomainStart<MoodleNetArangoContentGraphSubDomain> = {
    'ContentGraph.Counters.GlyphCreate': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [XXX({ persistence }), teardown]
      },
    },
    'ContentGraph.Node.Create': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [XXX({ persistence }), teardown]
      },
    },
    'ContentGraph.Edge.Create': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [XXX({ persistence }), teardown]
      },
    },
    'ContentGraph.Node.ById': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [XXX({ persistence }), teardown]
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
