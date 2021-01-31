import { routes } from '../../../lib/domain'
import { MoodleNetDomain } from '../../MoodleNetDomain'

export type HttpGqlRoutes = 'gql-request'
export const httpGqlServerRoutes = routes<MoodleNetDomain, HttpGqlRoutes>()
