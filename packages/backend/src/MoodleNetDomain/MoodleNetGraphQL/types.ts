import { GraphQLDomainWrk } from '../../lib/domain/wrk'
import { MoodleNetExecutionContext } from '../types'
export * from '../types'

export type RootValue = {}

export type GraphQLApi = GraphQLDomainWrk<MoodleNetExecutionContext, RootValue>

export type GQLServiceName = 'ContentGraph' | 'UserAccount'
