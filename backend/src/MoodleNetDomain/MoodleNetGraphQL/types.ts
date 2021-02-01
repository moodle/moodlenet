import { GraphQLDomainApi } from '../../lib/domain/api/types'
import { MoodleNetExecutionContext } from '../types'
export * from '../types'

export type RootValue = {}

export type GraphQLApi = GraphQLDomainApi<MoodleNetExecutionContext, RootValue>

export type GQLServiceName = 'ContentGraph' | 'UserAccount'
