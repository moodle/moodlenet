import { Maybe } from 'graphql/jsutils/Maybe'
import { Api } from '../../../lib/domain/api/types'
import { Event, LookupType } from '../../../lib/domain/event/types'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { Subject, User } from './graphql/content-graph.graphql.gen'

export type ContentGraph = {
  subject: {
    get: Api<{ id: string }, { subject: Subject | null }>
  }
  user: {
    get: Api<{ id: string }, { user: User | null }>
  }
}
