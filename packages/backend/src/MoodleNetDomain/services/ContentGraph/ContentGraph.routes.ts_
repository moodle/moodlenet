import { routes } from '../../../lib/domain'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { Edge, Node } from './ContentGraph.graphql.gen'

export type ContentGraphRoutes = Node['__typename'] | Edge['__typename']
export const contentGraphRoutes = routes<MoodleNetDomain, ContentGraphRoutes>()
